import { baseApi } from './baseApi';
import {
  User,
  UpdateProfileRequest,
  ChangePasswordRequest,
  DeleteAccountRequest,
  UsersResponse,
  UserResponse,
} from '@/types';

interface MessageResponse {
  success: boolean;
  message: string;
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/users/profile
    getProfile: builder.query<UserResponse, void>({
      query: () => '/users/profile',
      providesTags: ['User'],
    }),

    // PUT /api/users/profile
    updateProfile: builder.mutation<UserResponse, UpdateProfileRequest>({
      query: (data) => ({
        url: '/users/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // PUT /api/users/change-password
    changePassword: builder.mutation<MessageResponse, ChangePasswordRequest>({
      query: (data) => ({
        url: '/users/change-password',
        method: 'PUT',
        body: data,
      }),
    }),

    // DELETE /api/users/account
    deleteAccount: builder.mutation<MessageResponse, DeleteAccountRequest>({
      query: (data) => ({
        url: '/users/account',
        method: 'DELETE',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),

    // GET /api/users (Admin only)
    getAllUsers: builder.query<UsersResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/users?page=${page}&limit=${limit}`,
      providesTags: ['User'],
    }),

    // GET /api/users/:id (Admin only)
    getUserById: builder.query<UserResponse, string>({
      query: (id) => `/users/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'User', id }],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useGetAllUsersQuery,
  useLazyGetAllUsersQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
} = userApi;