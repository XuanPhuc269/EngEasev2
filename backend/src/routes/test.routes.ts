import { Router } from 'express';
import {
    createTest,
    getAllTests,
    getTestById,
    updateTest,
    deleteTest,
    publishTest,
    getTestsByType,
} from '../controllers/test.controller';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { UserRole } from '../models/User.model';
import {
    createTestValidation,
    idParamValidation,
    paginationValidation,
} from '../middleware/validation.middleware';

const router = Router();

/**
 * @route   POST /api/tests
 * @desc    Create a new test
 * @access  Private/Teacher/Admin
 */
router.post(
    '/',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    createTestValidation,
    createTest
);

/**
 * @route   GET /api/tests
 * @desc    Get all tests
 * @access  Public
 */
router.get('/', paginationValidation, getAllTests);

/**
 * @route   GET /api/tests/type/:type
 * @desc    Get tests by type
 * @access  Public
 */
router.get('/type/:type', paginationValidation, getTestsByType);

/**
 * @route   GET /api/tests/:id
 * @desc    Get test by ID
 * @access  Public
 */
router.get('/:id', idParamValidation, getTestById);

/**
 * @route   PUT /api/tests/:id
 * @desc    Update test
 * @access  Private/Teacher/Admin
 */
router.put(
    '/:id',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    updateTest
);

/**
 * @route   DELETE /api/tests/:id
 * @desc    Delete test
 * @access  Private/Teacher/Admin
 */
router.delete(
    '/:id',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    deleteTest
);

/**
 * @route   PATCH /api/tests/:id/publish
 * @desc    Publish test
 * @access  Private/Teacher/Admin
 */
router.patch(
    '/:id/publish',
    authenticate,
    authorize(UserRole.TEACHER, UserRole.ADMIN),
    idParamValidation,
    publishTest
);

export default router;
