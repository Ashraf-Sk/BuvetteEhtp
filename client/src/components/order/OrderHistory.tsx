import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Order } from '../../types/order.types';
import { OrderCard } from './OrderCard';
import { Spinner } from '../common/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../common/Tabs';
import { Package } from 'lucide-react';

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

        <TabsContent value={activeFilter} className="mt-6">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-sm">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg font-medium">{t('orders.no_orders') || 'Aucune commande'}</p>
              <p className="text-gray-400 text-sm mt-2">
                {activeFilter === 'all' 
                  ? t('orders.no_orders_desc') || 'Vous n\'avez pas encore passé de commande'
                  : t('orders.no_orders_filter') || `Aucune commande ${t(`orders.status_${activeFilter}`)?.toLowerCase()}`
                }
              </p>
            </div>
          ) : (
            <div>
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-900">{filteredOrders.length}</span>{' '}
                  {filteredOrders.length === 1 ? t('orders.order') || 'commande' : t('orders.orders') || 'commandes'}
                </p>
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

