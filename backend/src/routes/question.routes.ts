import { Router } from 'express';
import {
    createQuestion,
    getQuestionsByTestId,
    getQuestionById,
    updateQuestion,
    deleteQuestion,
    bulkCreateQuestions,
} from '../controllers/question.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User.model';
import { idParamValidation } from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/questions
 * @desc    Create a new question
 * @access  Private/Teacher/Admin
 */
router.post(
    '/',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    createQuestion
);

/**
 * @route   POST /api/questions/bulk
 * @desc    Bulk create questions
 * @access  Private/Teacher/Admin
 */
router.post(
    '/bulk',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    bulkCreateQuestions
);

/**
 * @route   GET /api/questions/test/:testId
 * @desc    Get questions by test ID
 * @access  Public
 */
router.get('/test/:testId', idParamValidation, getQuestionsByTestId);

/**
 * @route   GET /api/questions/:id
 * @desc    Get question by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, getQuestionById);

/**
 * @route   PUT /api/questions/:id
 * @desc    Update question
 * @access  Private/Teacher/Admin
 */
router.put(
    '/:id',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    updateQuestion
);

/**
 * @route   DELETE /api/questions/:id
 * @desc    Delete question
 * @access  Private/Teacher/Admin
 */
router.delete(
    '/:id',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    deleteQuestion
);

export default router;
