import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../hooks/useCart';
import { Button } from '../common/Button';

interface CartSummaryProps {
  onCheckout: () => void;
}

export const CartSummary: React.FC<CartSummaryProps> = ({ onCheckout }) => {
  const { t } = useTranslation();
  const { total, itemCount } = useCart();

  return (
    <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
      <h2 className="text-xl font-semibold mb-4">{t('cart.title')}</h2>

      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>{t('common.subtotal')}</span>
          <span>{total.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between text-gray-600">
          <span>Frais de service</span>
          <span>0.00 MAD</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-lg font-bold">
          <span>{t('common.total')}</span>
          <span className="text-primary">{total.toFixed(2)} MAD</span>
        </div>
      </div>

      <Button
        variant="primary"
        className="w-full"
        onClick={onCheckout}
        disabled={itemCount === 0}
      >
        {t('cart.checkout')}
      </Button>

      <p className="text-sm text-gray-500 text-center mt-4">
        {itemCount} {itemCount === 1 ? t('cart.item') : t('cart.items')}
      </p>
    </div>
  );
};

