export interface PaginationParams {
    page: number;
    limit: number;
    skip: number;
}

export interface ApiResponse<T = any> {
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

export interface TokenPayload {
    userId: string;
    email: string;
    role: string;
}

export interface QueryFilters {
    [key: string]: any;
}
