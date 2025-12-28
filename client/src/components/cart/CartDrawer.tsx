import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../hooks/useCart';
import { Sidebar } from '../layout/Sidebar';
import { CartItem } from './CartItem';
import { CartSummary } from './CartSummary';
import { Button } from '../common/Button';
import { ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
}) => {
  const { t } = useTranslation();
  const { items } = useCart();

  const handleCheckout = () => {
    onCheckout();
    onClose();
  };

  return (
    <Sidebar isOpen={isOpen} onClose={onClose} position="right" title={t('cart.title')}>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center py-12">
          <ShoppingBag className="w-16 h-16 text-gray-300 mb-4" />
          <p className="text-lg font-medium text-gray-500 mb-2">
            {t('cart.empty')}
          </p>
          <p className="text-sm text-gray-400 mb-6">{t('cart.empty_desc')}</p>
          <Button variant="outline" onClick={onClose}>
            {t('cart.view_menu')}
          </Button>
        </div>
      ) : (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto">
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>
          <div className="border-t pt-4 mt-auto">
            <CartSummary onCheckout={handleCheckout} />
          </div>
        </div>
      )}
    </Sidebar>
  );
};

