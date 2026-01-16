import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '@/types';
import Cookies from 'js-cookie';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Initialize state from cookies if available
const getInitialState = (): AuthState => {
  if (typeof window === 'undefined') {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  const accessToken = Cookies.get('accessToken') || null;
  const refreshToken = Cookies.get('refreshToken') || null;

  return {
    user: null,
    accessToken,
    refreshToken,
    isAuthenticated: !!accessToken,
    isLoading: true,
  };
};

const authSlice = createSlice({
  name: 'auth',
  initialState: getInitialState(),
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user?: User; accessToken: string; refreshToken: string }>
    ) => {
      if (action.payload.user) {
        state.user = action.payload.user;
      }
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;

      // Store tokens in cookies
      Cookies.set('accessToken', action.payload.accessToken, { 
        expires: 7,
        sameSite: 'lax',
      });
      Cookies.set('refreshToken', action.payload.refreshToken, { 
        expires: 30,
        sameSite: 'lax',
      });
    },

    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
    },

    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },

    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;

      // Remove tokens from cookies
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    initializeAuth: (state) => {
      const accessToken = Cookies.get('accessToken');
      const refreshToken = Cookies.get('refreshToken');

      if (accessToken && refreshToken) {
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
        state.isAuthenticated = true;
      } else {
        state.isAuthenticated = false;
      }
      state.isLoading = false;
    },
  },
});

export const { 
  setCredentials, 
  setUser, 
  updateUser, 
  logout, 
  setLoading, 
  initializeAuth 
} = authSlice.actions;

export default authSlice.reducer;