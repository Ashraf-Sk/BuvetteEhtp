import { Router } from 'express';
import * as paymentController from '../controllers/payment.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';
import express from 'express';

const router = Router();

// Webhook route must be before body parsing middleware
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  paymentController.handleStripeWebhook
);

// All other routes require authentication
router.post(
  '/create-intent',
  authenticate,
  apiRateLimiter,
  paymentController.createStripePaymentIntent
);

router.get(
  '/status/:paymentIntentId',
  authenticate,
  apiRateLimiter,
  paymentController.getStripePaymentStatus
);

export default router;

