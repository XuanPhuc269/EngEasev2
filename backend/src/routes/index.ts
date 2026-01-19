import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import testRoutes from './test.routes';
import questionRoutes from './question.routes';
import resultRoutes from './result.routes';
import progressRoutes from './progress.routes';
import dashboardRoutes from './dashboard.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tests', testRoutes);
router.use('/questions', questionRoutes);
router.use('/results', resultRoutes);
router.use('/progress', progressRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
