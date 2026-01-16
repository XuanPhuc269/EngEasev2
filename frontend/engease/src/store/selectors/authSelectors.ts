import { RootState } from '../index';

export const selectCurrentUser = (state: RootState) => state.auth.currentUser;
export const selectIsAuthenticated = (state: RootState) => state.auth.isAuthenticated;
export const selectAuthLoading = (state: RootState) => state.auth.loading;
export const selectAccessToken = (state: RootState) => state.auth.accessToken;
export const selectUserRoles = (state: RootState) => state.auth.currentUser?.roles;