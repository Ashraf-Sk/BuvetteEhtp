import { Router } from 'express';
import * as menuController from '../controllers/menu.controller';
import { apiRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

// Public routes
router.get('/pdf', apiRateLimiter, menuController.downloadMenuPDF);
router.get('/image', apiRateLimiter, menuController.downloadMenuImage);

export default router;

