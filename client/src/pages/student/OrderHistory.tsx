import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useOrders } from '../../hooks/useOrders';
import { OrderHistory as OrderHistoryComponent } from '../../components/order/OrderHistory';

export const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading } = useOrders(statusFilter === 'all' ? undefined : statusFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('orders.history')}</h1>
      <OrderHistoryComponent
        orders={data?.data || []}
        isLoading={isLoading}
        onStatusFilter={setStatusFilter}
        activeFilter={statusFilter}
      />
    </div>
  );
};

