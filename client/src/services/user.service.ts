import api from './api';
import { User } from '../types/user.types';
import { Product } from '../types/product.types';
import { ApiResponse } from '../types/common.types';

export const userService = {
  getProfile: async (): Promise<User> => {
    const response = await api.get<ApiResponse<{ user: User }>>('/user/profile');
    return response.data.data!.user;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await api.put<ApiResponse<{ user: User }>>('/user/profile', data);
    return response.data.data!.user;
  },

  changePassword: async (currentPassword: string, newPassword: string): Promise<void> => {
    await api.post('/user/change-password', { currentPassword, newPassword });
  },

  getFavorites: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<{ favorites: Product[] }>>('/user/favorites');
    return response.data.data!.favorites;
  },

  addFavorite: async (productId: string): Promise<void> => {
    await api.post(`/user/favorites/${productId}`);
  },

  removeFavorite: async (productId: string): Promise<void> => {
    await api.delete(`/user/favorites/${productId}`);
  },

  updatePushSubscription: async (subscription: PushSubscription): Promise<void> => {
    await api.post('/user/push-subscription', { pushSubscription: subscription });
  },
};

