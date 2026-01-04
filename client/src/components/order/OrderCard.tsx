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

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('orders.total')}</span>
          <span className="font-semibold text-primary">{order.totalAmount.toFixed(2)} MAD</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('cart.payment_method')}</span>
          <span className="font-medium">{order.paymentMethod === 'cash' ? t('cart.cash') : t('cart.card')}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>{t('common.quantity')}</span>
          <span>{order.items.reduce((sum, item) => sum + item.quantity, 0)} {t('cart.items')}</span>
        </div>
        {order.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 mb-1">{t('orders.items') || 'Articles'}:</p>
            <div className="space-y-1">
              {order.items.slice(0, 2).map((item, index) => (
                <div key={index} className="text-xs text-gray-600 flex justify-between">
                  <span className="truncate flex-1">{item.name[language]}</span>
                  <span className="ml-2">x{item.quantity}</span>
                </div>
              ))}
              {order.items.length > 2 && (
                <p className="text-xs text-gray-400">+{order.items.length - 2} {t('orders.more_items') || 'autres articles'}</p>
              )}
            </div>
          </div>
        )}
      </div>

      {showActions && (
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/orders/${order._id}/track`)}
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

