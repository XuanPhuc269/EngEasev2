import { baseApi } from './baseApi';

export interface DashboardStats {
  users: {
    total: number;
    active: number;
    students: number;
  };
  tests: {
    total: number;
    published: number;
    byType: Array<{ _id: string; count: number }>;
  };
  questions: {
    total: number;
  };
  results: {
    total: number;
    passed: number;
    passRate: number;
    averageScore: number;
  };
  recentActivity: {
    results: Array<{
      _id: string;
      userId: { _id: string; name: string; email: string };
      testId: { _id: string; title: string; type: string };
      score: number;
      isPassed: boolean;
      createdAt: string;
    }>;
    users: Array<{
      _id: string;
      name: string;
      email: string;
      role: string;
      createdAt: string;
    }>;
  };
}

export interface UserStats {
  byRole: Array<{ _id: string; count: number }>;
  growth: Array<{
    _id: { year: number; month: number };
    count: number;
  }>;
}

export interface TestStats {
  byTypeAndDifficulty: Array<{
    _id: { type: string; difficulty: string };
    count: number;
  }>;
  popular: Array<{
    testId: string;
    title: string;
    type: string;
    attempts: number;
    avgScore: number;
    passRate: number;
  }>;
}

interface DashboardResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // GET /api/dashboard/stats
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      transformResponse: (response: DashboardResponse<DashboardStats>) => response.data,
      providesTags: ['Dashboard'],
    }),

    // GET /api/dashboard/user-stats
    getUserStats: builder.query<UserStats, void>({
      query: () => '/dashboard/user-stats',
      transformResponse: (response: DashboardResponse<UserStats>) => response.data,
      providesTags: ['Dashboard'],
    }),

    // GET /api/dashboard/test-stats
    getTestStats: builder.query<TestStats, void>({
      query: () => '/dashboard/test-stats',
      transformResponse: (response: DashboardResponse<TestStats>) => response.data,
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetUserStatsQuery,
  useGetTestStatsQuery,
} = dashboardApi;
