import api from './api';
import { Order } from '../types/order.types';
import { Product } from '../types/product.types';
import { ApiResponse, PaginatedResponse } from '../types/common.types';

export interface DashboardStats {
  newOrders: number;
  preparing: number;
  ready: number;
  completedToday: number;
  lowStock: number;
}

export interface ReportData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  topProducts: Array<{
    product: Product;
    quantity: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
  revenueByDay: Array<{
    date: string;
    revenue: number;
    orders: number;
  }>;
}

export const employeeService = {
  getDashboardStats: async (): Promise<DashboardStats> => {
    const response = await api.get<ApiResponse<{ stats: DashboardStats }>>(
      '/employee/dashboard/stats'
    );
    return response.data.data!.stats;
  },

  getAllOrders: async (status?: string, page = 1, limit = 50): Promise<PaginatedResponse<Order>> => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) params.append('status', status);
    const response = await api.get<ApiResponse<PaginatedResponse<Order>>>(
      `/employee/orders?${params.toString()}`
    );
    return response.data.data!;
  },

  getOrdersByStatus: async (status: string): Promise<Order[]> => {
    const response = await api.get<ApiResponse<{ orders: Order[] }>>(
      `/employee/orders/${status}`
    );
    return response.data.data!.orders;
  },

  updateOrderStatus: async (orderId: string, status: string): Promise<Order> => {
    const response = await api.patch<ApiResponse<{ order: Order }>>(
      `/orders/${orderId}/status`,
      { status }
    );
    return response.data.data!.order;
  },

  getProducts: async (): Promise<Product[]> => {
    const response = await api.get<ApiResponse<{ products: Product[] }>>('/products');
    return response.data.data!.products;
  },

  createProduct: async (product: Partial<Product>): Promise<Product> => {
    const response = await api.post<ApiResponse<{ product: Product }>>('/products', product);
    return response.data.data!.product;
  },

  updateProduct: async (id: string, product: Partial<Product>): Promise<Product> => {
    const response = await api.put<ApiResponse<{ product: Product }>>(`/products/${id}`, product);
    return response.data.data!.product;
  },

  deleteProduct: async (id: string): Promise<void> => {
    await api.delete(`/products/${id}`);
  },

  updateProductStock: async (id: string, stock: number): Promise<Product> => {
    const response = await api.patch<ApiResponse<{ product: Product }>>(
      `/products/${id}/stock`,
      { stock }
    );
    return response.data.data!.product;
  },

  getReports: async (startDate?: string, endDate?: string): Promise<ReportData> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const response = await api.get<ApiResponse<ReportData>>(
      `/employee/reports?${params.toString()}`
    );
    return response.data.data!;
  },
};

