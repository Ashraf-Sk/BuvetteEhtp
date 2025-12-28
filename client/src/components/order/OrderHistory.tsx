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
        <TabsList>
          <TabsTrigger value="all">
            {t('common.all') || 'All'}
          </TabsTrigger>
          <TabsTrigger value="pending">
            {t('orders.status_pending')}
          </TabsTrigger>
          <TabsTrigger value="preparing">
            {t('orders.status_preparing')}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('orders.status_completed')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeFilter}>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">{t('orders.no_orders')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {filteredOrders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

