import { Response } from 'express';
import { validationResult } from 'express-validator';
import User from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { successResponse, errorResponse } from '../utils/response.util';

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            errorResponse(res, 'Người dùng không tồn tại', 404);
            return;
        }

        successResponse(res, {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            targetScore: user.targetScore,
            currentLevel: user.currentLevel,
            isEmailVerified: user.isEmailVerified,
            lastLogin: user.lastLogin,
            createdAt: user.createdAt,
        });
    } catch (error: any) {
        console.error('Get profile error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin người dùng', 500);
    }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
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

        const { name, targetScore, currentLevel, avatar } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            errorResponse(res, 'Người dùng không tồn tại', 404);
            return;
        }

        // Update fields
        if (name) user.name = name;
        if (targetScore !== undefined) user.targetScore = targetScore;
        if (currentLevel) user.currentLevel = currentLevel;
        if (avatar) user.avatar = avatar;

        await user.save();

        successResponse(
            res,
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                targetScore: user.targetScore,
                currentLevel: user.currentLevel,
            },
            'Cập nhật thông tin thành công'
        );
    } catch (error: any) {
        console.error('Update profile error:', error);
        errorResponse(res, error.message || 'Lỗi khi cập nhật thông tin', 500);
    }
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            errorResponse(res, 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới', 400);
            return;
        }

        const user = await User.findById(req.user.userId).select('+password');
        if (!user) {
            errorResponse(res, 'Người dùng không tồn tại', 404);
            return;
        }

        // Verify current password
        const isPasswordValid = await user.comparePassword(currentPassword);
        if (!isPasswordValid) {
            errorResponse(res, 'Mật khẩu hiện tại không đúng', 401);
            return;
        }

        // Update password
        user.password = newPassword;
        await user.save();

        successResponse(res, null, 'Đổi mật khẩu thành công');
    } catch (error: any) {
        console.error('Change password error:', error);
        errorResponse(res, error.message || 'Lỗi khi đổi mật khẩu', 500);
    }
};

export const deleteAccount = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        const { password } = req.body;

        if (!password) {
            errorResponse(res, 'Vui lòng cung cấp mật khẩu để xác nhận', 400);
            return;
        }

        const user = await User.findById(req.user.userId).select('+password');
        if (!user) {
            errorResponse(res, 'Người dùng không tồn tại', 404);
            return;
        }

        // Verify password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            errorResponse(res, 'Mật khẩu không đúng', 401);
            return;
        }

        // Delete user
        await User.findByIdAndDelete(req.user.userId);

        successResponse(res, null, 'Xóa tài khoản thành công');
    } catch (error: any) {
        console.error('Delete account error:', error);
        errorResponse(res, error.message || 'Lỗi khi xóa tài khoản', 500);
    }
};

// Admin only
export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password -refreshToken')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const total = await User.countDocuments();

        res.status(200).json({
            success: true,
            data: users,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error: any) {
        console.error('Get all users error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy danh sách người dùng', 500);
    }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password -refreshToken');
        if (!user) {
            errorResponse(res, 'Người dùng không tồn tại', 404);
            return;
        }

        successResponse(res, user);
    } catch (error: any) {
        console.error('Get user by id error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin người dùng', 500);
    }
};
