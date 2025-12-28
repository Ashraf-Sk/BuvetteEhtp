import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middleware/validation.middleware';
import { authenticate } from '../middleware/auth.middleware';
import { authRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Validation rules
const registerValidation = [
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('email')
    .isEmail()
    .withMessage('Valid email is required')
    .matches(/^[\w-\.]+@ehtp\.ac\.ma$/)
    .withMessage('Email must be a valid EHTP email'),
  body('studentId')
    .matches(/^EHTP-\d{4}$/i)
    .withMessage('Student ID must be in format EHTP-XXXX'),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  body('phoneNumber')
    .optional()
    .matches(/^(\+212|0)[5-7]\d{8}$/)
    .withMessage('Invalid phone number format'),
];

const loginValidation = [
  body('studentId').notEmpty().withMessage('Student ID is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const verifyEmailValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
];

const forgotPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
];

const resetPasswordValidation = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('code').isLength({ min: 6, max: 6 }).withMessage('Code must be 6 digits'),
  body('newPassword')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
];

// Routes
router.post('/register', authRateLimiter, validate(registerValidation), authController.register);
router.post('/verify-email', authRateLimiter, validate(verifyEmailValidation), authController.verifyEmail);
router.post('/login', authRateLimiter, validate(loginValidation), authController.login);
router.post('/forgot-password', authRateLimiter, validate(forgotPasswordValidation), authController.forgotPassword);
router.post('/verify-reset-code', authRateLimiter, validate(verifyEmailValidation), authController.verifyResetCode);
router.post('/reset-password', authRateLimiter, validate(resetPasswordValidation), authController.resetPassword);
router.get('/me', authenticate, authController.getMe);

export default router;

