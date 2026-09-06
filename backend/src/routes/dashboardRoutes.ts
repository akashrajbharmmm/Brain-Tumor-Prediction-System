import { Router } from 'express';
import { protect } from '../middleware/authMiddleware';
import { getDashboardStats } from '../controllers/dashboardController';

const router = Router();

router.get('/stats', protect, getDashboardStats);

export default router;