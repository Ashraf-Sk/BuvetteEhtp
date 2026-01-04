import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEmployeeOrdersByStatus, useUpdateOrderStatus } from '../../hooks/useEmployee';
import { Order } from '../../types/order.types';
import { Button } from '../../components/common/Button';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../components/common/Tabs';
import { 
  CheckCircle, 
  Package, 
  User,
  CreditCard,
  Wallet
} from 'lucide-react';
import { ORDER_STATUSES } from '../../utils/constants';

const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  const { t, language } = useTranslation();
  const { mutate: updateStatus, isPending } = useUpdateOrderStatus();

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

  const getNextStatus = (currentStatus: string): string | null => {
    const statusFlow: Record<string, string> = {
      pending: 'confirmed',
      confirmed: 'preparing',
      preparing: 'ready',
      ready: 'completed',
    };
    return statusFlow[currentStatus] || null;
  };

  const getStatusButton = (currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (!nextStatus) return null;

    const buttonLabels: Record<string, string> = {
      confirmed: t('employee.confirm_order') || 'Confirmer',
      preparing: t('employee.start_preparing') || 'Commencer la préparation',
      ready: t('employee.mark_ready') || 'Marquer comme prête',
      completed: t('employee.complete_order') || 'Compléter',
    };

    return (
      <Button
        variant="primary"
        size="sm"
        onClick={() => updateStatus({ orderId: order._id, status: nextStatus })}
        isLoading={isPending}
        disabled={isPending}
      >
        {buttonLabels[nextStatus] || 'Suivant'}
      </Button>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              #{order.orderNumber}
            </h3>
            <Badge variant={getStatusVariant(order.status)}>
              {ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES]?.[language]}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-1">
              <User className="w-4 h-4" />
              <span>
                {typeof order.student === 'object' && order.student && 'fullName' in order.student
                  ? (order.student as any).fullName || (order.student as any).email
                  : 'Client'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {order.paymentMethod === 'cash' ? (
                <Wallet className="w-4 h-4" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>
                {order.paymentMethod === 'cash' ? t('cart.cash') : t('cart.card')}
              </span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            {new Date(order.createdAt).toLocaleString(language)}
          </p>
        </div>
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('orders.items') || 'Articles'}:</span>
          <span className="font-medium">
            {order.items.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">{t('orders.total')}:</span>
          <span className="font-bold text-primary">{order.totalAmount.toFixed(2)} MAD</span>
        </div>
        {order.items.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm mb-1">
                <span className="text-gray-700">
                  {item.name[language]} x{item.quantity}
                </span>
                <span className="text-gray-600">{(item.price * item.quantity).toFixed(2)} MAD</span>
              </div>
            ))}
          </div>
        )}
        {order.notes && (
          <div className="mt-2 p-2 bg-gray-50 rounded text-sm text-gray-600">
            <strong>{t('orders.notes') || 'Notes'}:</strong> {order.notes}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {getStatusButton(order.status)}
        {order.status === 'ready' && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => updateStatus({ orderId: order._id, status: 'completed' })}
            isLoading={isPending}
            disabled={isPending}
            className="bg-success hover:bg-success-dark"
          >
            <CheckCircle className="w-4 h-4 mr-1" />
            {t('employee.complete_order') || 'Compléter'}
          </Button>
        )}
      </div>
    </div>
  );
};

export const OrderManagement: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('confirmed');
  
  const statusTabs = [
    { value: 'pending', label: t('orders.status_pending') || 'En attente' },
    { value: 'confirmed', label: t('orders.status_confirmed') || 'Confirmées' },
    { value: 'preparing', label: t('orders.status_preparing') || 'En préparation' },
    { value: 'ready', label: t('orders.status_ready') || 'Prêtes' },
  ];

  const { data: orders = [], isLoading } = useEmployeeOrdersByStatus(activeTab);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('employee.order_management') || 'Gestion des commandes'}
        </h1>
        <p className="text-gray-600">
          {t('employee.order_management_desc') || 'Gérez et suivez toutes les commandes'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="flex-wrap">
          {statusTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Spinner size="lg" />
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">
                {t('employee.no_orders_status') || `Aucune commande ${statusTabs.find(t => t.value === activeTab)?.label.toLowerCase()}`}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {orders.map((order) => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
