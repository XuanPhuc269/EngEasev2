import { Router } from 'express';
import {
    submitTest,
    getTestResult,
    getUserTestResults,
    getUserProgress,
    gradeWritingOrSpeaking,
} from '../controllers/result.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User.model';
import {
    submitTestValidation,
    idParamValidation,
    paginationValidation,
} from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/results/submit
 * @desc    Submit test answers
 * @access  Private
 */
router.post('/submit', authenticate, submitTestValidation, submitTest);

/**
 * @route   GET /api/results/:id
 * @desc    Get test result by ID
 * @access  Private
 */
router.get('/:id', authenticate, idParamValidation, getTestResult);

/**
 * @route   GET /api/results/user/me
 * @desc    Get current user's test results
 * @access  Private
 */
router.get('/user/me', authenticate, paginationValidation, getUserTestResults);

/**
 * @route   GET /api/results/progress/me
 * @desc    Get current user's progress
 * @access  Private
 */
router.get('/progress/me', authenticate, getUserProgress);

/**
 * @route   PUT /api/results/:id/grade
 * @desc    Grade writing or speaking test
 * @access  Private/Teacher/Admin
 */
router.put(
    '/:id/grade',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    gradeWritingOrSpeaking
);

export default router;
