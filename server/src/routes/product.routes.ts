import { Router } from 'express';
import * as productController from '../controllers/product.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public routes
router.get('/', apiRateLimiter, productController.getProducts);
router.get('/:id', apiRateLimiter, productController.getProduct);

// Protected routes (admin/employee only)
router.post(
  '/',
  authenticate,
  authorize('admin', 'employee'),
  productController.createProduct
);
router.put(
  '/:id',
  authenticate,
  authorize('admin', 'employee'),
  productController.updateProduct
);
router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  productController.deleteProduct
);
router.patch(
  '/:id/stock',
  authenticate,
  authorize('admin', 'employee'),
  productController.updateStock
);

export default router;

