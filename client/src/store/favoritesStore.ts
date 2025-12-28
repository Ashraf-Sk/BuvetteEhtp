import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FavoritesState {
  favoriteIds: string[];
  toggleFavorite: (productId: string) => void;
  isFavorite: (productId: string) => boolean;
  setFavorites: (ids: string[]) => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoriteIds: [],
      toggleFavorite: (productId) => {
        set((state) => {
          const isFavorite = state.favoriteIds.includes(productId);
          return {
            favoriteIds: isFavorite
              ? state.favoriteIds.filter((id) => id !== productId)
              : [...state.favoriteIds, productId],
          };
        });
      },
      isFavorite: (productId) => {
        return get().favoriteIds.includes(productId);
      },
      setFavorites: (ids) => set({ favoriteIds: ids }),
    }),
    {
      name: 'favorites-storage',
    }
  )
);

