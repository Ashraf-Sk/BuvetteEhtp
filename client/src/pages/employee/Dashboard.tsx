import React, { useEffect } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEmployeeStats } from '../../hooks/useEmployee';
import { useSocket } from '../../hooks/useSocket';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Package, 
  Clock, 
  CheckCircle, 
  ShoppingBag, 
  AlertTriangle,
  TrendingUp,
  Users,
  DollarSign
} from 'lucide-react';
import { Spinner } from '../../components/common/Spinner';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { data: stats, isLoading, refetch } = useEmployeeStats();
  const socket = useSocket();
  const queryClient = useQueryClient();

  // Listen for real-time order updates
  useEffect(() => {
    if (!socket) return;

    const handleOrderCreated = () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] });
    };

    const handleOrderUpdated = () => {
      queryClient.invalidateQueries({ queryKey: ['employee', 'stats'] });
      queryClient.invalidateQueries({ queryKey: ['employee', 'orders'] });
    };

    socket.on('order:created', handleOrderCreated);
    socket.on('order:updated', handleOrderUpdated);

    return () => {
      socket.off('order:created', handleOrderCreated);
      socket.off('order:updated', handleOrderUpdated);
    };
  }, [socket, queryClient]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const statCards = [
    {
      title: t('employee.stats.new_orders') || 'Nouvelles commandes',
      value: stats?.newOrders || 0,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
      borderColor: 'border-primary',
    },
    {
      title: t('employee.stats.preparing') || 'En préparation',
      value: stats?.preparing || 0,
      icon: Clock,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
      borderColor: 'border-warning',
    },
    {
      title: t('employee.stats.ready') || 'Prêtes',
      value: stats?.ready || 0,
      icon: CheckCircle,
      color: 'text-success',
      bgColor: 'bg-success/10',
      borderColor: 'border-success',
    },
    {
      title: t('employee.stats.completed_today') || 'Complétées aujourd\'hui',
      value: stats?.completedToday || 0,
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
      borderColor: 'border-info',
    },
    {
      title: t('employee.stats.low_stock') || 'Stock faible',
      value: stats?.lowStock || 0,
      icon: AlertTriangle,
      color: 'text-error',
      bgColor: 'bg-error/10',
      borderColor: 'border-error',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('nav.dashboard') || 'Tableau de bord'}</h1>
        <p className="text-gray-600">
          {t('employee.dashboard_desc') || 'Vue d\'ensemble en temps réel de votre activité'}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className={`bg-white rounded-lg shadow-md p-6 border-l-4 ${stat.borderColor} hover:shadow-lg transition-shadow`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                {index === 0 && stats && stats.newOrders > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
                    Nouveau
                  </span>
                )}
              </div>
              <h3 className="text-gray-500 text-sm mb-1">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold mb-4">
            {t('employee.quick_actions') || 'Actions rapides'}
          </h3>
          <div className="space-y-3">
            <a
              href="/employee/orders"
              className="block p-3 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
            >
              {t('employee.view_orders') || 'Voir toutes les commandes'}
            </a>
            <a
              href="/employee/inventory"
              className="block p-3 bg-warning/10 text-warning rounded-lg hover:bg-warning/20 transition-colors"
            >
              {t('employee.manage_inventory') || 'Gérer l\'inventaire'}
            </a>
            <a
              href="/employee/reports"
              className="block p-3 bg-success/10 text-success rounded-lg hover:bg-success/20 transition-colors"
            >
              {t('employee.view_reports') || 'Voir les rapports'}
            </a>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
          <h3 className="text-lg font-semibold mb-4">
            {t('employee.recent_activity') || 'Activité récente'}
          </h3>
          <div className="text-center py-8 text-gray-500">
            <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>{t('employee.no_recent_activity') || 'Aucune activité récente'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
