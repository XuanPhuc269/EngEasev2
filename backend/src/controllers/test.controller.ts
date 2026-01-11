import { Response } from 'express';
import { validationResult } from 'express-validator';
import Test from '../models/Test.model';
import Question from '../models/Question.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util';

export const createTest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, errors.array()[0].msg, 400);
            return;
        }

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const testData = {
            ...req.body,
            createdBy: req.user.userId,
        };

        const test = await Test.create(testData);

        successResponse(res, test, 'Tạo bài test thành công', 201);
    } catch (error: any) {
        console.error('Create test error:', error);
        errorResponse(res, error.message || 'Lỗi khi tạo bài test', 500);
    }
};

export const getAllTests = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const { type, difficulty, isPublished } = req.query;

        // Build filter
        const filter: any = {};
        if (type) filter.type = type;
        if (difficulty) filter.difficulty = difficulty;
        if (isPublished !== undefined) filter.isPublished = isPublished === 'true';

        const tests = await Test.find(filter)
            .populate('createdBy', 'name email')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Test.countDocuments(filter);

        paginatedResponse(res, tests, page, limit, total, 'Lấy danh sách bài test thành công');
    } catch (error: any) {
        console.error('Get all tests error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy danh sách bài test', 500);
    }
};

export const getTestById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const test = await Test.findById(id)
            .populate('createdBy', 'name email')
            .populate('questions');

        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        successResponse(res, test);
    } catch (error: any) {
        console.error('Get test by id error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin bài test', 500);
    }
};

export const updateTest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const test = await Test.findById(id);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Check if user is the creator or admin
        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền cập nhật bài test này', 403);
            return;
        }

        const updatedTest = await Test.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        successResponse(res, updatedTest, 'Cập nhật bài test thành công');
    } catch (error: any) {
        console.error('Update test error:', error);
        errorResponse(res, error.message || 'Lỗi khi cập nhật bài test', 500);
    }
};

export const deleteTest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const test = await Test.findById(id);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Check if user is the creator or admin
        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền xóa bài test này', 403);
            return;
        }

        // Delete all questions associated with this test
        await Question.deleteMany({ testId: id });

        // Delete test
        await Test.findByIdAndDelete(id);

        successResponse(res, null, 'Xóa bài test thành công');
    } catch (error: any) {
        console.error('Delete test error:', error);
        errorResponse(res, error.message || 'Lỗi khi xóa bài test', 500);
    }
};

export const publishTest = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const test = await Test.findById(id);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Check if user is the creator or admin
        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền publish bài test này', 403);
            return;
        }

        test.isPublished = true;
        await test.save();

        successResponse(res, test, 'Publish bài test thành công');
    } catch (error: any) {
        console.error('Publish test error:', error);
        errorResponse(res, error.message || 'Lỗi khi publish bài test', 500);
    }
};

export const getTestsByType = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { type } = req.params;
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const tests = await Test.find({ type, isPublished: true })
            .populate('createdBy', 'name')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await Test.countDocuments({ type, isPublished: true });

        paginatedResponse(res, tests, page, limit, total);
    } catch (error: any) {
        console.error('Get tests by type error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy danh sách bài test', 500);
    }
};
