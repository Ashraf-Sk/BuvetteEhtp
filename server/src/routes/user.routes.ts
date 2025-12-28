import { Router } from 'express';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.get('/profile', apiRateLimiter, userController.getProfile);
router.put('/profile', apiRateLimiter, userController.updateProfile);
router.post('/change-password', apiRateLimiter, userController.changePassword);
router.get('/favorites', apiRateLimiter, userController.getFavorites);
router.post('/favorites/:productId', apiRateLimiter, userController.addFavorite);
router.delete('/favorites/:productId', apiRateLimiter, userController.removeFavorite);
router.post('/push-subscription', apiRateLimiter, userController.updatePushSubscription);

export default router;

