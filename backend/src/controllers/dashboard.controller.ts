import { Request, Response } from 'express';
import User from '../models/User.model';
import Test from '../models/Test.model';
import Question from '../models/Question.model';
import TestResult from '../models/TestResult.model';
import { errorResponse, successResponse } from '../utils/response.util';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin/Teacher)
export const getDashboardStats = async (_req: Request, res: Response) => {
    try {
        // Count total users
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({
            lastLogin: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }, // Last 30 days
        });

        // Count students
        const totalStudents = await User.countDocuments({ role: 'student' });

        // Count tests
        const totalTests = await Test.countDocuments();
        const publishedTests = await Test.countDocuments({ isPublished: true });

        // Count questions
        const totalQuestions = await Question.countDocuments();

        // Count test results
        const totalResults = await TestResult.countDocuments();
        const passedResults = await TestResult.countDocuments({ isPassed: true });

        // Get recent test results
        const recentResults = await TestResult.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email')
            .populate('testId', 'title type')
            .select('userId testId score isPassed createdAt');

        // Calculate average score
        const scoreAgg = await TestResult.aggregate([
            {
                $group: {
                    _id: null,
                    avgScore: { $avg: '$score' },
                },
            },
        ]);
        const averageScore = scoreAgg.length > 0 ? Math.round(scoreAgg[0].avgScore) : 0;

        // Get test completion rate by type
        const testsByType = await Test.aggregate([
            {
                $group: {
                    _id: '$type',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Get recent users
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('name email role createdAt');

        const stats = {
            users: {
                total: totalUsers,
                active: activeUsers,
                students: totalStudents,
            },
            tests: {
                total: totalTests,
                published: publishedTests,
                byType: testsByType,
            },
            questions: {
                total: totalQuestions,
            },
            results: {
                total: totalResults,
                passed: passedResults,
                passRate: totalResults > 0 ? Math.round((passedResults / totalResults) * 100) : 0,
                averageScore,
            },
            recentActivity: {
                results: recentResults,
                users: recentUsers,
            },
        };

        successResponse(res, stats, 'Dashboard statistics retrieved successfully');
    } catch (error: any) {
        console.error('Error getting dashboard stats:', error);
        errorResponse(res, error.message, 500);
    }
};

// @desc    Get user statistics
// @route   GET /api/dashboard/user-stats
// @access  Private (Admin/Teacher)
export const getUserStats = async (_req: Request, res: Response) => {
    try {
        // Users by role
        const usersByRole = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 },
                },
            },
        ]);

        // Users registered over time (last 12 months)
        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: twelveMonthsAgo },
                },
            },
            {
                $group: {
                    _id: {
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { '_id.year': 1, '_id.month': 1 },
            },
        ]);

        const stats = {
            byRole: usersByRole,
            growth: userGrowth,
        };

        successResponse(res, stats, 'User statistics retrieved successfully');
    } catch (error: any) {
        console.error('Error getting user stats:', error);
        errorResponse(res, error.message, 500);
    }
};

// @desc    Get test statistics
// @route   GET /api/dashboard/test-stats
// @access  Private (Admin/Teacher)
export const getTestStats = async (_req: Request, res: Response) => {
    try {
        // Tests by type and difficulty
        const testsByTypeAndDifficulty = await Test.aggregate([
            {
                $group: {
                    _id: {
                        type: '$type',
                        difficulty: '$difficulty',
                    },
                    count: { $sum: 1 },
                },
            },
        ]);

        // Most popular tests (by result count)
        const popularTests = await TestResult.aggregate([
            {
                $group: {
                    _id: '$testId',
                    attempts: { $sum: 1 },
                    avgScore: { $avg: '$score' },
                    passRate: {
                        $avg: {
                            $cond: ['$isPassed', 1, 0],
                        },
                    },
                },
            },
            {
                $sort: { attempts: -1 },
            },
            {
                $limit: 10,
            },
            {
                $lookup: {
                    from: 'tests',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'test',
                },
            },
            {
                $unwind: '$test',
            },
            {
                $project: {
                    testId: '$_id',
                    title: '$test.title',
                    type: '$test.type',
                    attempts: 1,
                    avgScore: { $round: ['$avgScore', 1] },
                    passRate: { $round: [{ $multiply: ['$passRate', 100] }, 0] },
                },
            },
        ]);

        const stats = {
            byTypeAndDifficulty: testsByTypeAndDifficulty,
            popular: popularTests,
        };

        successResponse(res, stats, 'Test statistics retrieved successfully');
    } catch (error: any) {
        console.error('Error getting test stats:', error);
        errorResponse(res, error.message, 500);
    }
};
