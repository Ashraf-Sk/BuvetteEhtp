import { Request, Response, NextFunction } from 'express';
import User from '../models/User';
import Product from '../models/Product';
import { NotFoundError, ValidationError } from '../utils/errorHandler';

export const getProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id)
      .select('-password')
      .populate('favorites');

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

export const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { fullName, phoneNumber, preferredLanguage, profileImage } = req.body;

    const updateData: any = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (preferredLanguage) updateData.preferredLanguage = preferredLanguage;
    if (profileImage) updateData.profileImage = profileImage;

    const user = await User.findByIdAndUpdate(req.user!._id, updateData, {
      new: true,
      runValidators: true,
    }).select('-password');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user!._id).select('+password');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    const isPasswordValid = await user.comparePassword(currentPassword);

    if (!isPasswordValid) {
      throw new ValidationError('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    next(error);
  }
};

export const getFavorites = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const user = await User.findById(req.user!._id).populate('favorites');

    if (!user) {
      throw new NotFoundError('User not found');
    }

    res.json({
      success: true,
      data: { favorites: user.favorites },
    });
  } catch (error) {
    next(error);
  }
};

export const addFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId);

    if (!product) {
      throw new NotFoundError('Product not found');
    }

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    if (!user.favorites.includes(product._id)) {
      user.favorites.push(product._id);
      await user.save();
    }

    await user.populate('favorites');

    res.json({
      success: true,
      message: 'Product added to favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    next(error);
  }
};

export const removeFavorite = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;

    const user = await User.findById(req.user!._id);

    if (!user) {
      throw new NotFoundError('User not found');
    }

    user.favorites = user.favorites.filter(
      (favId) => favId.toString() !== productId
    );
    await user.save();

    await user.populate('favorites');

    res.json({
      success: true,
      message: 'Product removed from favorites',
      data: { favorites: user.favorites },
    });
  } catch (error) {
    next(error);
  }
};

export const updatePushSubscription = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { pushSubscription } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user!._id,
      { pushSubscription },
      { new: true }
    ).select('-password');

    res.json({
      success: true,
      message: 'Push subscription updated',
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

