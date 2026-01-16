import { baseApi } from './baseApi';
import {
  Question,
  QuestionsResponse,
  QuestionResponse,
  CreateQuestionRequest,
  BulkCreateQuestionsRequest,
} from '@/types';

interface MessageResponse {
  success: boolean;
  message: string;
}

interface BulkCreateResponse {
  success: boolean;
  message: string;
  data: Question[];
}

export const questionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/questions (Teacher/Admin)
    createQuestion: builder.mutation<QuestionResponse, CreateQuestionRequest>({
      query: (data) => ({
        url: '/questions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Question', id: 'LIST' },
        { type: 'Test', id: testId },
      ],
    }),

    // POST /api/questions/bulk (Teacher/Admin)
    bulkCreateQuestions: builder.mutation<BulkCreateResponse, BulkCreateQuestionsRequest>({
      query: (data) => ({
        url: '/questions/bulk',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { testId }) => [
        { type: 'Question', id: 'LIST' },
        { type: 'Test', id: testId },
      ],
    }),

    // GET /api/questions/test/:testId
    getQuestionsByTestId: builder.query<QuestionsResponse, string>({
      query: (testId) => `/questions/test/${testId}`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ _id }) => ({ type: 'Question' as const, id: _id })),
              { type: 'Question', id: 'LIST' },
            ]
          : [{ type: 'Question', id: 'LIST' }],
    }),

    // GET /api/questions/:id
    getQuestionById: builder.query<QuestionResponse, string>({
      query: (id) => `/questions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Question', id }],
    }),

    // PUT /api/questions/:id (Teacher/Admin)
    updateQuestion: builder.mutation<QuestionResponse, { id: string; data: Partial<CreateQuestionRequest> }>({
      query: ({ id, data }) => ({
        url: `/questions/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
      ],
    }),

    // DELETE /api/questions/:id (Teacher/Admin)
    deleteQuestion: builder.mutation<MessageResponse, string>({
      query: (id) => ({
        url: `/questions/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Question', id },
        { type: 'Question', id: 'LIST' },
        { type: 'Test', id: 'LIST' },
      ],
    }),
  }),
});

export const {
  useCreateQuestionMutation,
  useBulkCreateQuestionsMutation,
  useGetQuestionsByTestIdQuery,
  useLazyGetQuestionsByTestIdQuery,
  useGetQuestionByIdQuery,
  useLazyGetQuestionByIdQuery,
  useUpdateQuestionMutation,
  useDeleteQuestionMutation,
} = questionApi;