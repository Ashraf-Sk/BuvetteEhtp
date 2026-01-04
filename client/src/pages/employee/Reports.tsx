import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useEmployeeReports } from '../../hooks/useEmployee';
import { Spinner } from '../../components/common/Spinner';
import { Input } from '../../components/common/Input';
import { ORDER_STATUSES } from '../../utils/constants';
import { 
  TrendingUp, 
  DollarSign, 
  ShoppingBag, 
  BarChart3,
  Calendar,
  Package
} from 'lucide-react';

export const Reports: React.FC = () => {
  const { t, language } = useTranslation();
  const [startDate, setStartDate] = useState(
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);

  const { data: reports, isLoading } = useEmployeeReports(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const stats = [
    {
      title: t('employee.reports_labels.total_revenue') || 'Revenus totaux',
      value: `${(reports?.totalRevenue || 0).toFixed(2)} MAD`,
      icon: DollarSign,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: t('employee.reports_labels.total_orders') || 'Total commandes',
      value: reports?.totalOrders || 0,
      icon: ShoppingBag,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: t('employee.reports_labels.avg_order_value') || 'Panier moyen',
      value: `${(reports?.averageOrderValue || 0).toFixed(2)} MAD`,
      icon: TrendingUp,
      color: 'text-info',
      bgColor: 'bg-info/10',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{t('employee.reports') || 'Rapports et Analytics'}</h1>
        <p className="text-gray-600">
          {t('employee.reports_desc') || 'Analysez les performances et les statistiques de votre buvette'}
        </p>
      </div>

      {/* Date Range Filter */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Calendar className="w-5 h-5 text-gray-500" />
          <h3 className="font-semibold">{t('employee.select_period') || 'Sélectionner la période'}</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.start_date') || 'Date de début'}
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.end_date') || 'Date de fin'}
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-l-4 border-primary"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-gray-500 text-sm mb-2">{stat.title}</h3>
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Package className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">
              {t('employee.reports_labels.top_products') || 'Produits les plus vendus'}
            </h2>
          </div>
          {reports?.topProducts && reports.topProducts.length > 0 ? (
            <div className="space-y-3">
              {reports.topProducts.map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium">
                      {typeof item.product === 'object' && item.product
                        ? item.product.name[language]
                        : 'Produit'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {item.quantity} {t('common.quantity') || 'unités'} • {item.revenue.toFixed(2)} MAD
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">#{index + 1}</div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('employee.no_data') || 'Aucune donnée disponible'}</p>
            </div>
          )}
        </div>

        {/* Orders by Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <BarChart3 className="w-5 h-5 mr-2 text-primary" />
            <h2 className="text-xl font-semibold">
              {t('employee.reports_labels.orders_by_status') || 'Commandes par statut'}
            </h2>
          </div>
          {reports?.ordersByStatus ? (
            <div className="space-y-3">
              {Object.entries(reports.ordersByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium capitalize">
                    {ORDER_STATUSES[status as keyof typeof ORDER_STATUSES]?.[language] || status}
                  </span>
                  <span className="text-lg font-bold text-primary">{count as number}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>{t('employee.no_data') || 'Aucune donnée disponible'}</p>
            </div>
          )}
        </div>
      </div>

      {/* Revenue Chart (Simple) */}
      {reports?.revenueByDay && reports.revenueByDay.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">
            {t('employee.reports_labels.revenue_trend') || 'Évolution des revenus'}
          </h2>
          <div className="space-y-2">
            {reports.revenueByDay.slice(-7).map((day: any, index: number) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-gray-600">{day.date}</div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div
                      className="bg-primary h-6 rounded"
                      style={{
                        width: `${(day.revenue / (reports.revenueByDay?.reduce((max: number, d: any) => Math.max(max, d.revenue), 0) || 1)) * 100}%`,
                      }}
                    />
                    <span className="text-sm font-medium">{day.revenue.toFixed(2)} MAD</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {day.orders} {t('employee.orders') || 'commandes'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
