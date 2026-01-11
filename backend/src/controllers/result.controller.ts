import { Response } from 'express';
import { validationResult } from 'express-validator';
import TestResult from '../models/TestResult.model';
import Test from '../models/Test.model';
import Question from '../models/Question.model';
import Progress from '../models/Progress.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse, paginatedResponse } from '../utils/response.util';

// Helper function to calculate band score
const calculateBandScore = (correctAnswers: number, totalQuestions: number): number => {
    const percentage = (correctAnswers / totalQuestions) * 100;

    if (percentage >= 95) return 9;
    if (percentage >= 90) return 8.5;
    if (percentage >= 85) return 8;
    if (percentage >= 80) return 7.5;
    if (percentage >= 70) return 7;
    if (percentage >= 60) return 6.5;
    if (percentage >= 50) return 6;
    if (percentage >= 40) return 5.5;
    if (percentage >= 30) return 5;
    if (percentage >= 20) return 4.5;
    if (percentage >= 10) return 4;
    return 3.5;
};

export const submitTest = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const { testId, answers, timeSpent, startedAt } = req.body;

        // Get test
        const test = await Test.findById(testId);
        if (!test) {
            errorResponse(res, 'Bài test không tồn tại', 404);
            return;
        }

        // Get all questions
        const questions = await Question.find({ testId });
        const questionMap = new Map(questions.map((q) => [q._id.toString(), q]));

        // Grade answers
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let skippedAnswers = 0;

        const gradedAnswers = answers.map((answer: any) => {
            const question = questionMap.get(answer.questionId);

            if (!question) {
                return {
                    ...answer,
                    isCorrect: false,
                    pointsEarned: 0,
                };
            }

            // Skip grading for essay and speaking questions
            if (question.type === 'essay' || question.type === 'speaking') {
                return {
                    ...answer,
                    isCorrect: null,
                    pointsEarned: 0,
                };
            }

            let isCorrect = false;

            // Check answer based on question type
            if (question.type === 'multiple_choice') {
                const correctOption = question.options?.find((opt) => opt.isCorrect);
                isCorrect = answer.userAnswer === correctOption?.text;
            } else if (question.type === 'fill_in_blank' || question.type === 'short_answer') {
                const correctAns = Array.isArray(question.correctAnswer)
                    ? question.correctAnswer
                    : [question.correctAnswer];
                isCorrect = correctAns.some(
                    (ans) => ans?.toLowerCase().trim() === answer.userAnswer?.toLowerCase().trim()
                );
            } else if (question.type === 'true_false_not_given') {
                isCorrect = answer.userAnswer === question.correctAnswer;
            }

            if (isCorrect) {
                correctAnswers++;
            } else if (answer.userAnswer) {
                wrongAnswers++;
            } else {
                skippedAnswers++;
            }

            return {
                ...answer,
                isCorrect,
                pointsEarned: isCorrect ? question.points : 0,
            };
        });

        // Calculate score
        const score = calculateBandScore(correctAnswers, test.totalQuestions);
        const isPassed = score >= test.passScore;

        // Create test result
        const testResult = await TestResult.create({
            userId: req.user.userId,
            testId,
            answers: gradedAnswers,
            score,
            totalQuestions: test.totalQuestions,
            correctAnswers,
            wrongAnswers,
            skippedAnswers,
            timeSpent,
            isPassed,
            startedAt: startedAt || new Date(),
            completedAt: new Date(),
        });

        // Update user progress
        await updateUserProgress(req.user.userId, test.type, score, timeSpent);

        successResponse(res, testResult, 'Nộp bài test thành công', 201);
    } catch (error: any) {
        console.error('Submit test error:', error);
        errorResponse(res, error.message || 'Lỗi khi nộp bài test', 500);
    }
};

// Helper function to update user progress
const updateUserProgress = async (
    userId: string,
    testType: string,
    score: number,
    timeSpent: number
): Promise<void> => {
    let progress = await Progress.findOne({ userId });

    if (!progress) {
        progress = await Progress.create({
            userId,
            overallBandScore: score,
            totalTestsCompleted: 1,
            totalTimeSpent: Math.floor(timeSpent / 60), // Convert to minutes
            skillsProgress: [
                {
                    skillType: testType,
                    averageScore: score,
                    testsCompleted: 1,
                    lastTestDate: new Date(),
                    improvement: 0,
                },
            ],
            studyStreak: 1,
            lastStudyDate: new Date(),
        });
    } else {
        // Update overall stats
        progress.totalTestsCompleted += 1;
        progress.totalTimeSpent += Math.floor(timeSpent / 60);

        // Update skill progress
        const skillIndex = progress.skillsProgress.findIndex(
            (skill) => skill.skillType === testType
        );

        if (skillIndex !== -1) {
            const skill = progress.skillsProgress[skillIndex];
            const oldAverage = skill.averageScore;
            const newAverage =
                (oldAverage * skill.testsCompleted + score) / (skill.testsCompleted + 1);

            skill.averageScore = newAverage;
            skill.testsCompleted += 1;
            skill.lastTestDate = new Date();
            skill.improvement = ((newAverage - oldAverage) / oldAverage) * 100;
        } else {
            progress.skillsProgress.push({
                skillType: testType,
                averageScore: score,
                testsCompleted: 1,
                lastTestDate: new Date(),
                improvement: 0,
            });
        }

        // Calculate overall band score (average of all skills)
        const totalScore = progress.skillsProgress.reduce(
            (sum, skill) => sum + skill.averageScore,
            0
        );
        progress.overallBandScore = totalScore / progress.skillsProgress.length;

        // Update study streak
        const lastStudy = progress.lastStudyDate;
        const today = new Date();
        const diffDays = Math.floor(
            (today.getTime() - (lastStudy?.getTime() || 0)) / (1000 * 60 * 60 * 24)
        );

        if (diffDays === 1) {
            progress.studyStreak += 1;
        } else if (diffDays > 1) {
            progress.studyStreak = 1;
        }

        progress.lastStudyDate = today;

        await progress.save();
    }
};

export const getTestResult = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const result = await TestResult.findById(id)
            .populate('testId', 'title type difficulty')
            .populate('userId', 'name email');

        if (!result) {
            errorResponse(res, 'Kết quả không tồn tại', 404);
            return;
        }

        // Check if user owns this result or is admin
        if (result.userId._id.toString() !== req.user.userId && req.user.role !== 'admin') {
            errorResponse(res, 'Bạn không có quyền xem kết quả này', 403);
            return;
        }

        successResponse(res, result);
    } catch (error: any) {
        console.error('Get test result error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy kết quả', 500);
    }
};

export const getUserTestResults = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const results = await TestResult.find({ userId: req.user.userId })
            .populate('testId', 'title type difficulty')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await TestResult.countDocuments({ userId: req.user.userId });

        paginatedResponse(res, results, page, limit, total);
    } catch (error: any) {
        console.error('Get user test results error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy danh sách kết quả', 500);
    }
};

export const getUserProgress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const progress = await Progress.findOne({ userId: req.user.userId });

        if (!progress) {
            // Return empty progress if not found
            successResponse(res, {
                overallBandScore: 0,
                totalTestsCompleted: 0,
                totalTimeSpent: 0,
                skillsProgress: [],
                strengths: [],
                weaknesses: [],
                studyStreak: 0,
            });
            return;
        }

        successResponse(res, progress);
    } catch (error: any) {
        console.error('Get user progress error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy tiến độ học tập', 500);
    }
};

export const gradeWritingOrSpeaking = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const { id } = req.params;
        const { score, teacherFeedback } = req.body;

        const result = await TestResult.findById(id);
        if (!result) {
            errorResponse(res, 'Kết quả không tồn tại', 404);
            return;
        }

        // Update result
        result.score = score;
        result.teacherFeedback = teacherFeedback;
        result.gradedBy = req.user.userId as any;
        result.gradedAt = new Date();
        result.isPassed = score >= (await Test.findById(result.testId))!.passScore;

        await result.save();

        successResponse(res, result, 'Chấm bài thành công');
    } catch (error: any) {
        console.error('Grade writing or speaking error:', error);
        errorResponse(res, error.message || 'Lỗi khi chấm bài', 500);
    }
};
