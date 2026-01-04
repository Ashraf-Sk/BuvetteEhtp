import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useOrders } from '../../hooks/useOrders';
import { OrderHistory as OrderHistoryComponent } from '../../components/order/OrderHistory';
import { Order } from '../../types/order.types';
import { Package } from 'lucide-react';

export const OrderHistory: React.FC = () => {
  const { t } = useTranslation();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { data, isLoading, error } = useOrders(statusFilter === 'all' ? undefined : statusFilter);

  // Handle both paginated and non-paginated responses
  // The API returns { orders: Order[], pagination: {...} }
  const orders = (data?.data as { orders?: Order[]; pagination?: any })?.orders || [] as Order[];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center mb-2">
          <Package className="w-8 h-8 mr-3 text-primary" />
          <h1 className="text-3xl font-bold">{t('orders.history') || 'Historique des commandes'}</h1>
        </div>
        <p className="text-gray-600 mt-2">
          {t('orders.history_desc') || 'Consultez toutes vos commandes passées et en cours'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
          {t('errors.network_error') || 'Erreur lors du chargement des commandes'}
        </div>
      )}

      <OrderHistoryComponent
        orders={orders}
        isLoading={isLoading}
        onStatusFilter={setStatusFilter}
        activeFilter={statusFilter}
      />
    </div>
  );
};

