import { baseApi } from './baseApi';
import {
  TestResult,
  ResultsResponse,
  ResultResponse,
  SubmitTestRequest,
  GradeTestRequest,
  Progress,
  ProgressResponse,
} from '@/types';

// Re-export types from answer.types.ts for convenience
export type { TestResult, ResultsResponse, ResultResponse, SubmitTestRequest, GradeTestRequest } from '@/types';

export const resultApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/results/submit
    submitTest: builder.mutation<ResultResponse, SubmitTestRequest>({
      query: (data) => ({
        url: '/results/submit',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Result', 'Progress'],
    }),

    // GET /api/results/:id
    getTestResult: builder.query<ResultResponse, string>({
      query: (id) => `/results/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Result', id }],
    }),

    // GET /api/results/user/me
    getUserTestResults: builder.query<ResultsResponse, { page?: number; limit?: number }>({
      query: ({ page = 1, limit = 10 }) => `/results/user/me?page=${page}&limit=${limit}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Result' as const, id: _id })),
              { type: 'Result', id: 'LIST' },
            ]
          : [{ type: 'Result', id: 'LIST' }],
    }),

    // GET /api/results/progress/me
    getUserProgress: builder.query<ProgressResponse, void>({
      query: () => '/results/progress/me',
      providesTags: ['Progress'],
    }),

    // PUT /api/results/:id/grade (Teacher/Admin)
    gradeTest: builder.mutation<ResultResponse, { id: string; data: GradeTestRequest }>({
      query: ({ id, data }) => ({
        url: `/results/${id}/grade`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Result', id },
        { type: 'Result', id: 'LIST' },
        'Progress',
      ],
    }),
  }),
});

export const {
  useSubmitTestMutation,
  useGetTestResultQuery,
  useLazyGetTestResultQuery,
  useGetUserTestResultsQuery,
  useLazyGetUserTestResultsQuery,
  useGetUserProgressQuery,
  useLazyGetUserProgressQuery,
  useGradeTestMutation,
} = resultApi;