export interface ApiError {
  success: false;
  message: string;
}

export interface ApiSuccess<T> {
  success: true;
  message?: string;
  data: T;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

export interface PaginatedResponse<T> {
  success: boolean;
  message?: string;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}