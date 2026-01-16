import { baseApi } from './baseApi';
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
} from '@/types';

interface MessageResponse {
  success: boolean;
  message: string;
}

interface CurrentUserResponse {
  success: boolean;
  data: User;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data: {
    _id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/auth/register
    register: builder.mutation<RegisterResponse, RegisterRequest>({
      query: (userData) => ({
        url: '/auth/register',
        method: 'POST',
        body: userData,
      }),
    }),

    // POST /api/auth/login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),

    // GET /api/auth/verify-email?token=xxx
    verifyEmail: builder.query<MessageResponse, string>({
      query: (token) => `/auth/verify-email?token=${token}`,
    }),

    // POST /api/auth/forgot-password
    forgotPassword: builder.mutation<MessageResponse, ForgotPasswordRequest>({
      query: (data) => ({
        url: '/auth/forgot-password',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /api/auth/reset-password
    resetPassword: builder.mutation<MessageResponse, ResetPasswordRequest>({
      query: (data) => ({
        url: '/auth/reset-password',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /api/auth/refresh-token
    refreshToken: builder.mutation<RefreshTokenResponse, RefreshTokenRequest>({
      query: (data) => ({
        url: '/auth/refresh-token',
        method: 'POST',
        body: data,
      }),
    }),

    // POST /api/auth/logout
    logout: builder.mutation<MessageResponse, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['User'],
    }),

    // GET /api/auth/me
    getCurrentUser: builder.query<CurrentUserResponse, void>({
      query: () => '/auth/me',
      providesTags: ['User'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useVerifyEmailQuery,
  useLazyVerifyEmailQuery,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
  useLazyGetCurrentUserQuery,
} = authApi;