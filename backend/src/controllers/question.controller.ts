import { Response } from 'express';
import { validationResult } from 'express-validator';
import Question from '../models/Question.model';
import Test from '../models/Test.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse } from '../utils/response.util';

export const createQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const { testId } = req.body;

        // Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Check if user is the creator or admin
        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền thêm câu hỏi vào bài test này', 403);
            return;
        }

        const question = await Question.create(req.body);

        // Add question to test
        test.questions.push(question._id);
        await test.save();

        successResponse(res, question, 'Tạo câu hỏi thành công', 201);
    } catch (error: any) {
        console.error('Create question error:', error);
        errorResponse(res, error.message || 'Lỗi khi tạo câu hỏi', 500);
    }
};

export const getQuestionsByTestId = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { testId } = req.params;

        const questions = await Question.find({ testId }).sort({ questionNumber: 1 });

        successResponse(res, questions);
    } catch (error: any) {
        console.error('Get questions by test id error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy danh sách câu hỏi', 500);
    }
};

export const getQuestionById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const question = await Question.findById(id);
        if (!question) {
            errorResponse(res, 'Câu hỏi không tồn tại', 404);
            return;
        }

        successResponse(res, question);
    } catch (error: any) {
        console.error('Get question by id error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin câu hỏi', 500);
    }
};

export const updateQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const question = await Question.findById(id);
        if (!question) {
            errorResponse(res, 'Câu hỏi không tồn tại', 404);
            return;
        }

        // Check if user is the test creator or admin
        const test = await Test.findById(question.testId);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền cập nhật câu hỏi này', 403);
            return;
        }

        const updatedQuestion = await Question.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });

        successResponse(res, updatedQuestion, 'Cập nhật câu hỏi thành công');
    } catch (error: any) {
        console.error('Update question error:', error);
        errorResponse(res, error.message || 'Lỗi khi cập nhật câu hỏi', 500);
    }
};

export const deleteQuestion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const question = await Question.findById(id);
        if (!question) {
            errorResponse(res, 'Câu hỏi không tồn tại', 404);
            return;
        }

        // Check if user is the test creator or admin
        const test = await Test.findById(question.testId);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền xóa câu hỏi này', 403);
            return;
        }

        // Remove question from test
        test.questions = test.questions.filter((q) => q.toString() !== id);
        await test.save();

        // Delete question
        await Question.findByIdAndDelete(id);

        successResponse(res, null, 'Xóa câu hỏi thành công');
    } catch (error: any) {
        console.error('Delete question error:', error);
        errorResponse(res, error.message || 'Lỗi khi xóa câu hỏi', 500);
    }
};

export const bulkCreateQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const { testId, questions } = req.body;

        if (!testId || !questions || !Array.isArray(questions)) {
            errorResponse(res, 'testId và mảng questions là bắt buộc', 400);
            return;
        }

        // Check if test exists
        const test = await Test.findById(testId);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Check if user is the creator or admin
        if (test.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền thêm câu hỏi vào bài test này', 403);
            return;
        }

        // Add testId to all questions
        const questionsWithTestId = questions.map((q) => ({
            ...q,
            testId,
        }));

        // Bulk insert
        const createdQuestions = await Question.insertMany(questionsWithTestId);

        // Add all question IDs to test
        const questionIds = createdQuestions.map((q) => q._id);
        test.questions.push(...questionIds);
        await test.save();

        successResponse(res, createdQuestions, 'Tạo câu hỏi thành công', 201);
    } catch (error: any) {
        console.error('Bulk create questions error:', error);
        errorResponse(res, error.message || 'Lỗi khi tạo câu hỏi', 500);
    }
};
