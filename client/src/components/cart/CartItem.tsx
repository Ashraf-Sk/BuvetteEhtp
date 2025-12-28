import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { CartItem as CartItemType } from '../../types/order.types';
import { useCart } from '../../hooks/useCart';

interface CartItemProps {
  item: CartItemType;
}

export const CartItem: React.FC<CartItemProps> = ({ item }) => {
  const { t, language } = useTranslation();
  const { updateItemQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (newQuantity: number) => {
    updateItemQuantity(item.productId, newQuantity);
  };

  const handleRemove = () => {
    removeFromCart(item.productId);
  };

  const productName = item.product?.name?.[language] || 'Produit';

  return (
    <div className="flex items-center space-x-4 p-4 border-b">
      {/* Image */}
      <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
        {item.product?.image ? (
          <img
            src={item.product.image}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-gray-900 truncate">{productName}</h3>
        <p className="text-sm text-gray-500">{item.price} MAD</p>

        {/* Quantity controls */}
        <div className="flex items-center space-x-2 mt-2">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            className="p-1 rounded border hover:bg-gray-100"
            disabled={item.quantity <= 1}
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="w-8 text-center font-medium">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            className="p-1 rounded border hover:bg-gray-100"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Price and remove */}
      <div className="flex flex-col items-end space-y-2">
        <span className="font-bold text-lg">
          {item.price * item.quantity} MAD
        </span>
        <button
          onClick={handleRemove}
          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors"
          aria-label={t('cart.remove')}
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

