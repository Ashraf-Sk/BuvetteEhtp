import React from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useOrder } from '../../hooks/useOrders';
import { OrderStatusTracker } from '../../components/order/OrderStatusTracker';
import { Spinner } from '../../components/common/Spinner';

export const OrderTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t, language } = useTranslation();
  const { data: orderData, isLoading } = useOrder(id || '');

  if (isLoading || !orderData) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const order = orderData;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">#{order.orderNumber}</h1>
        <p className="text-gray-500">
          {new Date(order.createdAt).toLocaleString(language)}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 mb-8">
        <OrderStatusTracker status={order.status} />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{t('orders.details')}</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-gray-600">{t('common.total')}</span>
            <span className="font-semibold">{order.totalAmount} MAD</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">{t('cart.payment_method')}</span>
            <span>{order.paymentMethod === 'cash' ? t('cart.cash') : t('cart.card')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

