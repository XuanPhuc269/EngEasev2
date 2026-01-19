import { baseApi } from './baseApi';
import {
  Test,
  TestsResponse,
  TestResponse,
  CreateTestRequest,
  UpdateTestRequest,
  TestFilters,
  TestType,
} from '@/types';

interface MessageResponse {
  success: boolean;
  message: string;
}

export const testApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/tests (Teacher/Admin)
    createTest: builder.mutation<TestResponse, CreateTestRequest>({
      query: (data) => ({
        url: '/tests',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Test'],
    }),

    // GET /api/tests
    getAllTests: builder.query<TestsResponse, TestFilters>({
      query: ({ page = 1, limit = 10, type, difficulty, isPublished }) => {
        const params = new URLSearchParams();
        params.append('page', page.toString());
        params.append('limit', limit.toString());
        if (type) params.append('type', type);
        if (difficulty) params.append('difficulty', difficulty);
        if (isPublished !== undefined) params.append('isPublished', isPublished.toString());
        return `/tests?${params.toString()}`;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Test' as const, id: _id })),
              { type: 'Test', id: 'LIST' },
            ]
          : [{ type: 'Test', id: 'LIST' }],
    }),

    // GET /api/tests/type/:type
    getTestsByType: builder.query<TestsResponse, { type: TestType; page?: number; limit?: number }>({
      query: ({ type, page = 1, limit = 10 }) => 
        `/tests/type/${type}?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Test' as const, id: _id })),
              { type: 'Test', id: 'LIST' },
            ]
          : [{ type: 'Test', id: 'LIST' }],
    }),

    // GET /api/tests/:id
    getTestById: builder.query<TestResponse, string>({
      query: (id) => `/tests/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Test', id }],
    }),

    // PUT /api/tests/:id (Teacher/Admin)
    updateTest: builder.mutation<TestResponse, { id: string; data: UpdateTestRequest }>({
      query: ({ id, data }) => ({
        url: `/tests/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
      ],
    }),

    // DELETE /api/tests/:id (Teacher/Admin)
    deleteTest: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/tests/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    // PATCH /api/tests/:id/publish (Teacher/Admin)
    publishTest: builder.mutation<TestResponse, string>({
      query: (id) => ({
        url: `/tests/${id}/publish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
      ],
    }),

    // PATCH /api/tests/:id/unpublish (Teacher/Admin)
    unpublishTest: builder.mutation<TestResponse, string>({
      query: (id) => ({
        url: `/tests/${id}/unpublish`,
        method: 'PATCH',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Test', id },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateTestMutation,
  useGetAllTestsQuery,
  useLazyGetAllTestsQuery,
  useGetTestsByTypeQuery,
  useLazyGetTestsByTypeQuery,
  useGetTestByIdQuery,
  useLazyGetTestByIdQuery,
  useUpdateTestMutation,
  useDeleteTestMutation,
  usePublishTestMutation,
  useUnpublishTestMutation,
} = testApi;