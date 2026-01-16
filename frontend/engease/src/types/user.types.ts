import { User } from './auth.types';
import { PaginationInfo } from './test.types';

export interface UpdateProfileRequest {
  name?: string;
  targetScore?: number;
  currentLevel?: string;
  avatar?: string;
}

export interface UsersResponse {
  success: boolean;
  data: User[];
  pagination: PaginationInfo;
}

export interface UserResponse {
  success: boolean;
  data: User;
}

export interface DeleteAccountRequest {
  password: string;
}