import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Order } from '../../types/order.types';
import { OrderCard } from './OrderCard';
import { Spinner } from '../common/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../common/Tabs';

interface OrderHistoryProps {
  orders: Order[];
  isLoading?: boolean;
  onStatusFilter?: (status: string) => void;
  activeFilter?: string;
}

export const OrderHistory: React.FC<OrderHistoryProps> = ({
  orders,
  isLoading,
  onStatusFilter,
  activeFilter = 'all',
}) => {
  const { t } = useTranslation();

  const filteredOrders = activeFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === activeFilter);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const handleValueChange = (value: string) => {
    onStatusFilter?.(value);
  };

  return (
    <div>
      <Tabs value={activeFilter} onValueChange={handleValueChange}>
        <TabsList className="flex-wrap">
          <TabsTrigger value="all">
            {t('common.all') || 'Toutes'}
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('orders.status_pending')}
          </TabsTrigger>
          <TabsTrigger value="confirmed">
            {t('orders.status_confirmed')}
          </TabsTrigger>
          <TabsTrigger value="preparing">
            {t('orders.status_preparing')}
          </TabsTrigger>
          <TabsTrigger value="ready">
            {t('orders.status_ready')}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('orders.status_completed')}
          </TabsTrigger>
          <TabsTrigger value="cancelled">
            {t('orders.status_cancelled')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('orders.no_orders')}</p>
            </div>
          ) : (
            <div className="mt-6">
              <div className="mb-4 text-sm text-gray-600">
                {filteredOrders.length} {filteredOrders.length === 1 ? t('orders.order') || 'commande' : t('orders.orders') || 'commandes'}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOrders.map((order) => (
                  <OrderCard key={order._id} order={order} />
                ))}
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

