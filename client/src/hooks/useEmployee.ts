import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { employeeService } from '../services/employee.service';
import { Product } from '../types/product.types';

export const useEmployeeStats = () => {
  return useQuery({
    queryKey: ['employee', 'stats'],
    queryFn: () => employeeService.getDashboardStats(),
    refetchInterval: 10000, // Refetch every 10 seconds for real-time updates
  });
};

export const useEmployeeOrders = (status?: string, page = 1) => {
  return useQuery({
    queryKey: ['employee', 'orders', status, page],
    queryFn: () => employeeService.getAllOrders(status, page),
    refetchInterval: 5000, // Refetch every 5 seconds
  });
};

export const useEmployeeOrdersByStatus = (status: string) => {
  return useQuery({
    queryKey: ['employee', 'orders', status],
    queryFn: () => employeeService.getOrdersByStatus(status),
    refetchInterval: 5000,
    enabled: !!status,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) =>
      employeeService.updateOrderStatus(orderId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] });
      queryClient.invalidateQueries({ queryKey: ['employee', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      toast.success('Statut de la commande mis à jour');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useEmployeeProducts = () => {
  return useQuery({
    queryKey: ['employee', 'products'],
    queryFn: () => employeeService.getProducts(),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (product: Partial<Product>) => employeeService.createProduct(product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit créé avec succès');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création');
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, product }: { id: string; product: Partial<Product> }) =>
      employeeService.updateProduct(id, product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit mis à jour');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour');
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => employeeService.deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success('Produit supprimé');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression');
    },
  });
};

export const useUpdateStock = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, stock }: { id: string; stock: number }) =>
      employeeService.updateProductStock(id, stock),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['employee', 'stats'] });
      toast.success('Stock mis à jour');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la mise à jour du stock');
    },
  });
};

export const useEmployeeReports = (startDate?: string, endDate?: string) => {
  return useQuery({
    queryKey: ['employee', 'reports', startDate, endDate],
    queryFn: () => employeeService.getReports(startDate, endDate),
  });
};

