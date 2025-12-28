import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import { generateToken } from '../config/jwt';
import { sendVerificationEmail, sendPasswordResetEmail } from '../services/email.service';
import { ValidationError, UnauthorizedError, NotFoundError } from '../utils/errorHandler';

export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, email, studentId, password, phoneNumber } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { studentId: studentId.toUpperCase() }],
    });

    if (existingUser) {
      if (existingUser.email === email.toLowerCase()) {
        throw new ValidationError('Email already registered');
      }
      if (existingUser.studentId === studentId.toUpperCase()) {
        throw new ValidationError('Student ID already registered');
      }
    }

    // Generate verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create user
    const user = await User.create({
      fullName,
      email: email.toLowerCase(),
      studentId: studentId.toUpperCase(),
      password,
      phoneNumber,
      verificationCode,
      isVerified: false,
    });

    // Send verification email
    try {
      await sendVerificationEmail(user.email, verificationCode);
    } catch (emailError) {
      console.error('Failed to send verification email:', emailError);
      // Continue even if email fails
    }

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          isVerified: user.isVerified,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (user.isVerified) {
      throw new ValidationError('Email already verified');
    }

    if (user.verificationCode !== code) {
      throw new ValidationError('Invalid verification code');
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Email verified successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { studentId, password } = req.body;

    const user = await User.findOne({ studentId: studentId.toUpperCase() }).select('+password');

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new UnauthorizedError('Please verify your email first');
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          studentId: user.studentId,
          role: user.role,
          preferredLanguage: user.preferredLanguage,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Don't reveal if user exists or not for security
      res.json({
        success: true,
        message: 'If the email exists, a reset code has been sent',
      });
      return;
    }

    // Generate reset code
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordCode = resetCode;
    user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await user.save();

    // Send reset email
    try {
      await sendPasswordResetEmail(user.email, resetCode);
    } catch (emailError) {
      console.error('Failed to send reset email:', emailError);
    }

    res.json({
      success: true,
      message: 'If the email exists, a reset code has been sent',
    });
  } catch (error) {
    next(error);
  }
};

export const verifyResetCode = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      throw new ValidationError('No reset code found');
    }

    if (user.resetPasswordCode !== code) {
      throw new ValidationError('Invalid reset code');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new ValidationError('Reset code has expired');
    }

    res.json({
      success: true,
      message: 'Reset code verified',
    });
  } catch (error) {
    next(error);
  }
};

export const resetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { email, code, newPassword } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.resetPasswordCode || !user.resetPasswordExpires) {
      throw new ValidationError('No reset code found');
    }

    if (user.resetPasswordCode !== code) {
      throw new ValidationError('Invalid reset code');
    }

    if (user.resetPasswordExpires < new Date()) {
      throw new ValidationError('Reset code has expired');
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordCode = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({
      success: true,
      message: 'Password reset successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .populate('favorites')
      .select('-password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

