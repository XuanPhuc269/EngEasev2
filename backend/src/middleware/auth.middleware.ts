import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt.util';
import User, { UserRole } from '../models/User.model';

export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: UserRole;
    };
}

export const authenticate = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({
                success: false,
                message: 'Không tìm thấy token. Vui lòng đăng nhập.',
            });
            return;
        }

        const token = authHeader.split(' ')[1];

        const decoded = verifyAccessToken(token);

        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Người dùng không tồn tại.',
            });
            return;
        }

        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role as UserRole,
        };

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            message: 'Token không hợp lệ hoặc đã hết hạn.',
        });
    }
};

export const authorize = (...roles: UserRole[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: 'Vui lòng đăng nhập.',
            });
            return;
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                message: 'Bạn không có quyền truy cập tài nguyên này.',
            });
            return;
        }

        next();
    };
};
