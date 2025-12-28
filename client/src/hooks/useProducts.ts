import { useQuery } from '@tanstack/react-query';
import { productService } from '../services/product.service';
import { ProductFilters } from '../types/product.types';

export const useProducts = (filters?: ProductFilters) => {
  return useQuery({
    queryKey: ['products', filters],
    queryFn: () => productService.getProducts(filters),
    staleTime: 30000, // 30 seconds
  });
};

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productService.getProduct(id),
    enabled: !!id,
  });
};

