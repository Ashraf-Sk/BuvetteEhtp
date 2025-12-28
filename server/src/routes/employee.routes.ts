import { Router } from 'express';
import * as employeeController from '../controllers/employee.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// All routes require authentication and employee/admin role
router.use(authenticate);
router.use(authorize('employee', 'admin'));

router.get('/dashboard/stats', apiRateLimiter, employeeController.getDashboardStats);
router.get('/orders', apiRateLimiter, employeeController.getAllOrders);
router.get('/orders/:status', apiRateLimiter, employeeController.getOrdersByStatus);

export default router;

