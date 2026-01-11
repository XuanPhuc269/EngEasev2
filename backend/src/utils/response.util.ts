import { Response } from 'express';

interface SuccessResponse<T = any> {
    success: boolean;
    message?: string;
    data?: T;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}

export const successResponse = <T>(
    res: Response,
    data?: T,
    message?: string,
    statusCode: number = 200
): Response<SuccessResponse<T>> => {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
};

export const paginatedResponse = <T>(
    res: Response,
    data: T[],
    page: number,
    limit: number,
    total: number,
    message?: string
): Response<SuccessResponse<T[]>> => {
    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    });
};

export const errorResponse = (
    res: Response,
    message: string,
    statusCode: number = 500
): Response => {
    return res.status(statusCode).json({
        success: false,
        message,
    });
};
