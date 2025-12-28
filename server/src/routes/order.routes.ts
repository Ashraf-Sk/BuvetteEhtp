import { Router } from 'express';
import * as orderController from '../controllers/order.controller';
import { authenticate } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All routes require authentication
router.use(authenticate);

router.post('/', apiRateLimiter, orderController.createOrder);
router.get('/', apiRateLimiter, orderController.getOrders);
router.get('/:id', apiRateLimiter, orderController.getOrder);
router.patch('/:id/status', apiRateLimiter, orderController.updateOrderStatus);
router.delete('/:id', apiRateLimiter, orderController.cancelOrder);

export default router;

