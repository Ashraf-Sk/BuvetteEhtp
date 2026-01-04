import api from './api';
import { Order, CreateOrderData } from '../types/order.types';
import { ApiResponse, PaginatedResponse } from '../types/common.types';

export const orderService = {
  createOrder: async (data: CreateOrderData): Promise<Order> => {
    const response = await api.post<ApiResponse<{ order: Order }>>('/orders', data);
    return response.data.data!.order;
  },

  getOrders: async (status?: string, page = 1, limit = 20): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    const response = await api.get<ApiResponse<{ orders: Order[]; pagination: any }>>(
      `/orders?${params.toString()}`
    );
    // Backend returns { orders: Order[], pagination: {...} } but we normalize it to PaginatedResponse
    const backendData = response.data.data!;
    return {
      data: backendData.orders,
      pagination: backendData.pagination,
    };
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<ApiResponse<{ order: Order }>>(`/orders/${id}`);
    return response.data.data!.order;
  },

  cancelOrder: async (id: string, reason?: string): Promise<Order> => {
    const response = await api.delete<ApiResponse<{ order: Order }>>(`/orders/${id}`, {
      data: { cancellationReason: reason },
    });
    return response.data.data!.order;
  },
};

