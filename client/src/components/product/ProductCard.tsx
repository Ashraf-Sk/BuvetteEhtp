import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Product } from '../../types/product.types';
import { FavoriteButton } from './FavoriteButton';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const [imageError, setImageError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
    >
      {/* Image */}
      <div className="relative aspect-square bg-gray-200">
        {!imageError && product.image ? (
          <img
            src={product.image}
            alt={product.name[language]}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <ShoppingCart className="w-12 h-12" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-2">
          {product.isPopular && (
            <Badge variant="warning">{t('products.popular')}</Badge>
          )}
          {!product.isAvailable && (
            <Badge variant="error">{t('products.out_of_stock')}</Badge>
          )}
        </div>

        {/* Favorite button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton productId={product._id} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {product.name[language]}
        </h3>
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description[language]}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-primary">
            {product.price} MAD
          </span>
          <Button
            variant="primary"
            size="sm"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
          >
            <ShoppingCart className="w-4 h-4 mr-1" />
            {t('products.add_to_cart')}
          </Button>
        </div>
      </div>
    </div>
  );
};

