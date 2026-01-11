import { Request, Response, NextFunction } from 'express';

interface ErrorResponse extends Error {
    statusCode?: number;
    errors?: any;
}

export const errorHandler = (
    err: ErrorResponse,
    _req: Request,
    res: Response,
    _next: NextFunction
): void => {
    let error = { ...err };
    error.message = err.message;

    // Log error for debugging
    console.error(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = 'Tài nguyên không tìm thấy';
        error = { name: 'CastError', message } as ErrorResponse;
        error.statusCode = 404;
    }

    // Mongoose duplicate key
    if ((err as any).code === 11000) {
        const message = 'Dữ liệu đã tồn tại';
        error = { name: 'DuplicateError', message } as ErrorResponse;
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values((err as any).errors)
            .map((val: any) => val.message)
            .join(', ');
        error = { name: 'ValidationError', message } as ErrorResponse;
        error.statusCode = 400;
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Lỗi server',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

export const notFound = (req: Request, res: Response): void => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} không tồn tại`,
    });
};
