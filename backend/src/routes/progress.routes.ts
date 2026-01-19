import { Router } from 'express';
import { getMyProgress, updateTargetScore } from '../controllers/progress.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All progress routes require authentication
router.use(authenticate);

// GET /api/progress/my-progress - Get user's progress
router.get('/my-progress', getMyProgress);

// PUT /api/progress/target-score - Update target score
router.put('/target-score', updateTargetScore);

export default router;
