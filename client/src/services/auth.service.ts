import api from './api';
import { RegisterData, LoginData, AuthResponse, User } from '../types/user.types';
import { ApiResponse } from '../types/common.types';

export const authService = {
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/register', data);
    return response.data.data!;
  },

  verifyEmail: async (email: string, code: string): Promise<void> => {
    await api.post('/auth/verify-email', { email, code });
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<ApiResponse<AuthResponse>>('/auth/login', data);
    return response.data.data!;
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post('/auth/forgot-password', { email });
  },

  verifyResetCode: async (email: string, code: string): Promise<void> => {
    await api.post('/auth/verify-reset-code', { email, code });
  },

  resetPassword: async (email: string, code: string, newPassword: string): Promise<void> => {
    await api.post('/auth/reset-password', { email, code, newPassword });
  },

  getMe: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/auth/me');
    return response.data.data!.user;
  },
};

