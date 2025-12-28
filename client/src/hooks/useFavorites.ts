import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { userService } from '../services/user.service';
import { useAuthStore } from '../store/authStore';
import { useFavoritesStore } from '../store/favoritesStore';
import { Product } from '../types/product.types';

export const useFavorites = () => {
  const { isAuthenticated } = useAuthStore();
  const { favoriteIds, setFavorites } = useFavoritesStore();

  const { data, isLoading } = useQuery<Product[]>({
    queryKey: ['favorites'],
    queryFn: () => userService.getFavorites(),
    enabled: isAuthenticated,
  });

  useEffect(() => {
    if (data) {
      setFavorites(data.map((p: Product) => p._id));
    }
  }, [data, setFavorites]);

  return { favorites: data || [], isLoading, favoriteIds };
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const { toggleFavorite: toggleFavoriteStore, favoriteIds } = useFavoritesStore();

  const addMutation = useMutation({
    mutationFn: (productId: string) => userService.addFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const removeMutation = useMutation({
    mutationFn: (productId: string) => userService.removeFavorite(productId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const toggleFavorite = (productId: string) => {
    const isFavorite = favoriteIds.includes(productId);

    // Optimistic update
    toggleFavoriteStore(productId);

    if (isAuthenticated) {
      if (isFavorite) {
        removeMutation.mutate(productId);
      } else {
        addMutation.mutate(productId);
      }
    }
  };

  return { toggleFavorite, isToggling: addMutation.isPending || removeMutation.isPending };
};

