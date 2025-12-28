import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { Order } from '../../types/order.types';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { ORDER_STATUSES } from '../../utils/constants';

interface OrderCardProps {
  order: Order;
  showActions?: boolean;
}

export const OrderCard: React.FC<OrderCardProps> = ({
  order,
  showActions = true,
}) => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  const statusConfig = ORDER_STATUSES[order.status];

  const getStatusVariant = (status: string): 'default' | 'success' | 'warning' | 'error' => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'ready':
        return 'success';
      case 'preparing':
      case 'confirmed':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            #{order.orderNumber}
          </h3>
          <p className="text-sm text-gray-500">
            {new Date(order.createdAt).toLocaleDateString(language, {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        <Badge variant={getStatusVariant(order.status)}>
          {statusConfig[language]}
        </Badge>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>{t('orders.total')}</span>
          <span className="font-semibold">{order.totalAmount} MAD</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('checkout.payment_method')}</span>
          <span>{order.paymentMethod === 'cash' ? t('cart.cash') : t('cart.card')}</span>
        </div>
      </div>

      {showActions && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/orders/${order._id}`)}
          >
            {t('orders.details')}
          </Button>
          {order.status === 'ready' || order.status === 'preparing' || order.status === 'confirmed' ? (
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate(`/orders/${order._id}/track`)}
            >
              {t('orders.track')}
            </Button>
          ) : null}
        </div>
      )}
    </div>
  );
};

