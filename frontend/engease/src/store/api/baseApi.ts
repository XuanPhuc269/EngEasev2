import { createApi, fetchBaseQuery, BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';
import Cookies from 'js-cookie';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken || Cookies.get('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = Cookies.get('refreshToken');
    
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: '/auth/refresh-token',
          method: 'POST',
          body: { refreshToken },
        },
        api,
        extraOptions
      );

      if (refreshResult.data) {
        const data = refreshResult.data as { success: boolean; data: { accessToken: string; refreshToken: string } };
        
        if (data.success) {
          Cookies.set('accessToken', data.data.accessToken, { expires: 7 });
          Cookies.set('refreshToken', data.data.refreshToken, { expires: 30 });
          
          api.dispatch({ type: 'auth/setCredentials', payload: data.data });
          
          result = await baseQuery(args, api, extraOptions);
        }
      } else {
        api.dispatch({ type: 'auth/logout' });
        Cookies.remove('accessToken');
        Cookies.remove('refreshToken');
      }
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['User', 'Test', 'Question', 'Result', 'Progress', 'Dashboard'],
  endpoints: () => ({}),
});