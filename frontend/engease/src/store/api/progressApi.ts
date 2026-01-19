import { baseApi } from './baseApi';
import { Progress, ProgressResponse } from '@/types/progress.types';

export const progressApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyProgress: builder.query<ProgressResponse, void>({
      query: () => '/progress/my-progress',
      providesTags: ['Progress'],
    }),
    updateTargetScore: builder.mutation<ProgressResponse, { targetScore: number }>({
      query: (body) => ({
        url: '/progress/target-score',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Progress'],
    }),
  }),
});

export const {
  useGetMyProgressQuery,
  useUpdateTargetScoreMutation,
} = progressApi;
