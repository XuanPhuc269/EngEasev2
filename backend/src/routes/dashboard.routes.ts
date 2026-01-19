import { Router } from 'express';
import {
    getDashboardStats,
    getUserStats,
    getTestStats,
} from '../controllers/dashboard.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All dashboard routes require authentication and admin/teacher role
router.use(authenticate);

// @route   GET /api/dashboard/stats
router.get('/stats', getDashboardStats);

// @route   GET /api/dashboard/user-stats
router.get('/user-stats', getUserStats);

// @route   GET /api/dashboard/test-stats
router.get('/test-stats', getTestStats);

export default router;
