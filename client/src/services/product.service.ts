import api from './api';
import { Product, ProductFilters } from '../types/product.types';
import { ApiResponse, PaginatedResponse } from '../types/common.types';

export const productService = {
  getProducts: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          if (Array.isArray(value)) {
            value.forEach((v) => params.append(key, v));
          } else {
            params.append(key, String(value));
          }
        }
      });
    }
    const response = await api.get<ApiResponse<{ products: Product[]; pagination: any }>>(
      `/products?${params.toString()}`
    );
    // Transform backend response to match frontend PaginatedResponse structure
    return {
      data: response.data.data!.products,
      pagination: response.data.data!.pagination,
    };
  },

  getProduct: async (id: string): Promise<Product> => {
    const response = await api.get<ApiResponse<{ product: Product }>>(`/products/${id}`);
    return response.data.data!.product;
  },
};

