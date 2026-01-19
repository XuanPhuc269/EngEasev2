import { Response } from 'express';
import TestResult from '../models/TestResult.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse } from '../utils/response.util';

export const getMyProgress = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        // Get all test results for the user
        const results = await TestResult.find({ userId: req.user.userId })
            .populate('testId')
            .sort({ createdAt: -1 });

        if (results.length === 0) {
            successResponse(res, null, 'Chưa có dữ liệu tiến độ');
            return;
        }

        // Calculate statistics
        const totalTests = results.length;
        const avgScore = results.reduce((sum, r) => sum + r.score, 0) / totalTests;
        const totalTimeSpent = results.reduce((sum, r) => sum + r.timeSpent, 0);

        // Group by skill type (test type) for skillsProgress
        const scoreByType = results.reduce((acc: any, result: any) => {
            const skillType = result.testId?.type || 'unknown';
            if (!acc[skillType]) {
                acc[skillType] = {
                    skillType,
                    scores: [],
                    testDates: [],
                };
            }
            acc[skillType].scores.push(result.score);
            acc[skillType].testDates.push(new Date(result.createdAt));
            return acc;
        }, {});

        // Format skillsProgress array
        const skillsProgress = Object.values(scoreByType).map((skill: any) => {
            const scores = (skill.scores as number[]);
            const averageScore = scores.reduce((s: number, v: number) => s + v, 0) / scores.length;
            const testDates = (skill.testDates as Date[]);
            const lastTestDate = testDates.length > 0 ? new Date(Math.max(...testDates.map(d => d.getTime()))) : null;
            
            // Calculate improvement (difference between first and last 3 tests)
            let improvement = 0;
            if (scores.length > 3) {
                const firstAvg = scores.slice(0, 3).reduce((s: number, v: number) => s + v, 0) / 3;
                const lastAvg = scores.slice(-3).reduce((s: number, v: number) => s + v, 0) / 3;
                improvement = Number((lastAvg - firstAvg).toFixed(2));
            }

            return {
                skillType: skill.skillType,
                averageScore: Number(averageScore.toFixed(1)),
                testsCompleted: scores.length,
                lastTestDate: lastTestDate?.toISOString() || null,
                improvement,
            };
        });

        // Identify strengths (skills with score >= 6.5) and weaknesses (score < 5)
        const strengths = skillsProgress
            .filter((s: any) => s.averageScore >= 6.5)
            .map((s: any) => s.skillType.charAt(0).toUpperCase() + s.skillType.slice(1));
        
        const weaknesses = skillsProgress
            .filter((s: any) => s.averageScore < 5)
            .map((s: any) => s.skillType.charAt(0).toUpperCase() + s.skillType.slice(1));

        // Calculate study streak (days with at least one test)
        const datesWithTests = new Set(
            results.map((r: any) => new Date(r.createdAt).toDateString())
        );
        const lastTestDate = results[0]?.createdAt ? new Date(results[0].createdAt) : null;
        let studyStreak = 0;
        if (lastTestDate) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            let currentDate = new Date(lastTestDate);
            currentDate.setHours(0, 0, 0, 0);
            
            while (datesWithTests.has(currentDate.toDateString())) {
                studyStreak++;
                currentDate.setDate(currentDate.getDate() - 1);
            }
        }

        // Recent activity (latest 5 test results)
        const recentActivity = results.slice(0, 5).map((r: any) => ({
            testTitle: r.testId?.title || 'Bài test',
            score: r.score,
            isPassed: r.isPassed,
            createdAt: r.createdAt,
        }));

        const progress = {
            _id: req.user.userId,
            userId: req.user.userId,
            overallBandScore: Number(avgScore.toFixed(1)),
            totalTestsCompleted: totalTests,
            totalTimeSpent,
            skillsProgress,
            strengths,
            weaknesses,
            studyStreak,
            lastStudyDate: results[0]?.createdAt || null,
            targetScore: null,
            progressToTarget: null,
            recentActivity,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        successResponse(res, progress, 'Lấy thông tin tiến độ thành công');
    } catch (error: any) {
        console.error('Get progress error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin tiến độ', 500);
    }
};

export const updateTargetScore = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const { targetScore } = req.body;

        if (typeof targetScore !== 'number' || targetScore < 0 || targetScore > 9) {
            errorResponse(res, 'Điểm mục tiêu phải từ 0 đến 9', 400);
            return;
        }

        // For now, just return success
        // In a real app, you'd save this to a user preferences table
        successResponse(res, { targetScore }, 'Cập nhật mục tiêu thành công');
    } catch (error: any) {
        console.error('Update target score error:', error);
        errorResponse(res, error.message || 'Lỗi khi cập nhật mục tiêu', 500);
    }
};
