import { apiClient, ApiResponse } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SignupData {
  email: string;
  password: string;
  name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export const authService = {
  // Sign up a new user
  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/signup',
      data
    );
    return response.data.data;
  },

  // Login user
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return response.data.data;
  },

  // Get current user profile
  async getProfile(): Promise<User> {
    const response = await apiClient.get<ApiResponse<{ user: User }>>(
      '/auth/me'
    );
    return response.data.data.user;
  },

  // Update user profile
  async updateProfile(data: Partial<SignupData>): Promise<User> {
    const response = await apiClient.put<ApiResponse<{ user: User }>>(
      '/auth/me',
      data
    );
    return response.data.data.user;
  },

  // Delete account
  async deleteAccount(): Promise<void> {
    await apiClient.delete('/auth/me');
  },
};

