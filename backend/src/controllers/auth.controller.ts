import { Response } from 'express';
import { validationResult } from 'express-validator';
import User, { UserRole } from '../models/User.model';
import { AuthRequest } from '../middleware/auth.middleware';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.util';
import { sendVerificationEmail, sendResetPasswordEmail, sendWelcomeEmail } from '../utils/email.util';
import { successResponse, errorResponse } from '../utils/response.util';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const register = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        // Validate request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, errors.array()[0].msg, 400);
            return;
        }

        const { email, password, name, role } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            errorResponse(res, 'Email đã được sử dụng', 400);
            return;
        }

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        // Create user
        const user = await User.create({
            email,
            password,
            name,
            role: role || UserRole.STUDENT,
            emailVerificationToken: verificationToken,
            isEmailVerified: false,
        });

        // Send verification email
        await sendVerificationEmail(email, name, verificationToken);

        successResponse(
            res,
            {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            'Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản.',
            201
        );
    } catch (error: any) {
        console.error('Register error:', error);
        errorResponse(res, error.message || 'Lỗi khi đăng ký', 500);
    }
};

export const login = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, errors.array()[0].msg, 400);
            return;
        }

        const { email, password } = req.body;

        // Find user and include password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            errorResponse(res, 'Email hoặc mật khẩu không đúng', 401);
            return;
        }

        // Check if email is verified
        if (!user.isEmailVerified) {
            errorResponse(res, 'Vui lòng xác thực email trước khi đăng nhập', 401);
            return;
        }

        // Generate tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const accessToken = generateAccessToken(tokenPayload);
        const refreshToken = generateRefreshToken(tokenPayload);

        // Save refresh token to database
        user.refreshToken = refreshToken;
        user.lastLogin = new Date();
        await user.save();

        successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    avatar: user.avatar,
                    targetScore: user.targetScore,
                    currentLevel: user.currentLevel,
                },
                accessToken,
                refreshToken,
            },
            'Đăng nhập thành công'
        );
    } catch (error: any) {
        console.error('Login error:', error);
        errorResponse(res, error.message || 'Lỗi khi đăng nhập', 500);
    }
};

export const verifyEmail = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { token } = req.query;

        if (!token) {
            errorResponse(res, 'Token không hợp lệ', 400);
            return;
        }

        const user = await User.findOne({ emailVerificationToken: token });
        if (!user) {
            errorResponse(res, 'Token không hợp lệ hoặc đã hết hạn', 400);
            return;
        }

        // Verify email
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        await user.save();

        // Send welcome email
        await sendWelcomeEmail(user.email, user.name);

        successResponse(res, null, 'Xác thực email thành công');
    } catch (error: any) {
        console.error('Verify email error:', error);
        errorResponse(res, error.message || 'Lỗi khi xác thực email', 500);
    }
};

export const forgotPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, errors.array()[0].msg, 400);
            return;
        }

        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            // Don't reveal if user exists
            successResponse(res, null, 'Nếu email tồn tại, bạn sẽ nhận được email đặt lại mật khẩu');
            return;
        }

        // Generate reset token
        const resetToken = user.generateResetPasswordToken();
        await user.save();

        // Send reset password email
        await sendResetPasswordEmail(user.email, user.name, resetToken);

        successResponse(res, null, 'Email đặt lại mật khẩu đã được gửi');
    } catch (error: any) {
        console.error('Forgot password error:', error);
        errorResponse(res, error.message || 'Lỗi khi gửi email đặt lại mật khẩu', 500);
    }
};

export const resetPassword = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            errorResponse(res, errors.array()[0].msg, 400);
            return;
        }

        const { token, password } = req.body;

        // Hash the token from request to compare with stored hash
        const users = await User.find({ resetPasswordExpire: { $gt: Date.now() } }).select('+resetPasswordToken');

        let user = null;
        for (const u of users) {
            if (u.resetPasswordToken && bcrypt.compareSync(token, u.resetPasswordToken)) {
                user = u;
                break;
            }
        }

        if (!user) {
            errorResponse(res, 'Token không hợp lệ hoặc đã hết hạn', 400);
            return;
        }

        // Reset password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        successResponse(res, null, 'Đặt lại mật khẩu thành công');
    } catch (error: any) {
        console.error('Reset password error:', error);
        errorResponse(res, error.message || 'Lỗi khi đặt lại mật khẩu', 500);
    }
};

export const refreshToken = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            errorResponse(res, 'Refresh token là bắt buộc', 400);
            return;
        }

        // Verify refresh token
        const decoded = verifyRefreshToken(refreshToken);

        // Find user and check if refresh token matches
        const user = await User.findById(decoded.userId).select('+refreshToken');
        if (!user || user.refreshToken !== refreshToken) {
            errorResponse(res, 'Refresh token không hợp lệ', 401);
            return;
        }

        // Generate new tokens
        const tokenPayload = {
            userId: user._id.toString(),
            email: user.email,
            role: user.role,
        };

        const newAccessToken = generateAccessToken(tokenPayload);
        const newRefreshToken = generateRefreshToken(tokenPayload);

        // Update refresh token in database
        user.refreshToken = newRefreshToken;
        await user.save();

        successResponse(
            res,
            {
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            },
            'Token đã được làm mới'
        );
    } catch (error: any) {
        console.error('Refresh token error:', error);
        errorResponse(res, 'Refresh token không hợp lệ hoặc đã hết hạn', 401);
    }
};

export const logout = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            errorResponse(res, 'Người dùng chưa đăng nhập', 401);
            return;
        }

        // Clear refresh token
        await User.findByIdAndUpdate(req.user.userId, {
            refreshToken: undefined,
        });

        successResponse(res, null, 'Đăng xuất thành công');
    } catch (error: any) {
        console.error('Logout error:', error);
        errorResponse(res, error.message || 'Lỗi khi đăng xuất', 500);
    }
};

export const getCurrentUser = async (req: AuthRequest, res: Response): Promise<void> => {
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
        console.error('Get current user error:', error);
        errorResponse(res, error.message || 'Lỗi khi lấy thông tin người dùng', 500);
    }
};
