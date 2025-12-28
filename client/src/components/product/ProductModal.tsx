import React, { useState } from 'react';
import { Plus, Minus, ShoppingCart, Star, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { Product } from '../../types/product.types';
import { Modal } from '../common/Modal';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { FavoriteButton } from './FavoriteButton';
import { useCart } from '../../hooks/useCart';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  isOpen,
  onClose,
}) => {
  const { t, language } = useTranslation();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [imageError, setImageError] = useState(false);

  if (!product) return null;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    onClose();
  };

  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg" title={product.name[language]}>
      <div className="space-y-6">
        {/* Image */}
        <div className="relative aspect-video bg-gray-200 rounded-lg overflow-hidden">
          {!imageError && product.image ? (
            <img
              src={product.image}
              alt={product.name[language]}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <ShoppingCart className="w-16 h-16" />
            </div>
          )}

          <div className="absolute top-4 right-4">
            <FavoriteButton productId={product._id} size="lg" />
          </div>

          {product.isPopular && (
            <div className="absolute top-4 left-4">
              <Badge variant="warning">{t('products.popular')}</Badge>
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <h3 className="text-2xl font-bold mb-2">{product.name[language]}</h3>
          <p className="text-gray-600">{product.description[language]}</p>
        </div>

        {/* Info */}
        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <div className="flex items-center space-x-1">
            <Clock className="w-4 h-4" />
            <span>
              {product.preparationTime} {t('products.minutes')}
            </span>
          </div>
          {product.averageRating > 0 && (
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span>{product.averageRating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* Nutritional info */}
        {product.nutritionalInfo && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-2">{t('products.calories')}</h4>
            {product.nutritionalInfo.calories && (
              <p>{product.nutritionalInfo.calories} kcal</p>
            )}
            {product.nutritionalInfo.allergens && product.nutritionalInfo.allergens.length > 0 && (
              <div className="mt-2">
                <h5 className="font-medium mb-1">{t('products.allergens')}</h5>
                <div className="flex flex-wrap gap-2">
                  {product.nutritionalInfo.allergens.map((allergen, idx) => (
                    <Badge key={idx} variant="warning" size="sm">
                      {allergen}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Price and quantity */}
        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-3xl font-bold text-primary">
              {product.price} MAD
            </span>

            {product.isAvailable ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={decrementQuantity}
                  className="p-2 rounded-lg border hover:bg-gray-100"
                  disabled={quantity <= 1}
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="text-lg font-semibold w-8 text-center">
                  {quantity}
                </span>
                <button
                  onClick={incrementQuantity}
                  className="p-2 rounded-lg border hover:bg-gray-100"
                  disabled={quantity >= product.stock}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Badge variant="error">{t('products.out_of_stock')}</Badge>
            )}
          </div>

          <Button
            variant="primary"
            className="w-full"
            onClick={handleAddToCart}
            disabled={!product.isAvailable}
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            {t('products.add_to_cart')} - {product.price * quantity} MAD
          </Button>
        </div>
      </div>
    </Modal>
  );
};

