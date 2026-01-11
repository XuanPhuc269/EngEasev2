import jwt from 'jsonwebtoken';

export interface JWTPayload {
    userId: string;
    email: string;
    role: string;
}

export const generateAccessToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, process.env.JWT_SECRET as string, { expiresIn: '30d' });
};

export const generateRefreshToken = (payload: JWTPayload): string => {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, { expiresIn: '30d' });
};

export const verifyAccessToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET as string) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired token');
    }
};

export const verifyRefreshToken = (token: string): JWTPayload => {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_SECRET as string) as JWTPayload;
    } catch (error) {
        throw new Error('Invalid or expired refresh token');
    }
};

export const decodeToken = (token: string): JWTPayload | null => {
    try {
        return jwt.decode(token) as JWTPayload;
    } catch (error) {
        return null;
    }
};
