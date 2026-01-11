import { Router } from 'express';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import testRoutes from './test.routes';
import questionRoutes from './question.routes';
import resultRoutes from './result.routes';

const router = Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/tests', testRoutes);
router.use('/questions', questionRoutes);
router.use('/results', resultRoutes);

export default router;
