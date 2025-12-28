import React from 'react';
import { Heart } from 'lucide-react';
import { useToggleFavorite } from '../../hooks/useFavorites';
import { useFavoritesStore } from '../../store/favoritesStore';
import { clsx } from 'clsx';

interface FavoriteButtonProps {
  productId: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  productId,
  size = 'md',
  className,
}) => {
  const { toggleFavorite } = useToggleFavorite();
  const { isFavorite } = useFavoritesStore();

  const favorite = isFavorite(productId);

  const sizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <button
      onClick={(e) => {
        e.stopPropagation();
        toggleFavorite(productId);
      }}
      className={clsx(
        'p-2 rounded-full transition-all hover:scale-110',
        favorite
          ? 'text-error bg-error/10 hover:bg-error/20'
          : 'text-gray-400 hover:text-error hover:bg-gray-100',
        className
      )}
      aria-label={favorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={clsx(sizes[size], favorite ? 'fill-current' : '')}
      />
    </button>
  );
};

