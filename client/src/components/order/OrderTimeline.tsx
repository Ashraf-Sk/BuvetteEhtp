import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Order } from '../../types/order.types';

interface OrderTimelineProps {
  order: Order;
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ order }) => {
  const { t, language } = useTranslation();

  const timeline = [
    {
      event: 'created',
      label: t('orders.status_confirmed'),
      timestamp: order.createdAt,
      completed: true,
    },
    {
      event: 'preparing',
      label: t('orders.status_preparing'),
      timestamp: order.status === 'preparing' || order.status === 'ready' || order.status === 'completed' ? order.updatedAt : null,
      completed: ['preparing', 'ready', 'completed'].includes(order.status),
    },
    {
      event: 'ready',
      label: t('orders.status_ready'),
      timestamp: order.status === 'ready' || order.status === 'completed' ? order.updatedAt : null,
      completed: ['ready', 'completed'].includes(order.status),
    },
    {
      event: 'completed',
      label: t('orders.status_completed'),
      timestamp: order.completedAt || null,
      completed: order.status === 'completed',
    },
  ];

  return (
    <div className="space-y-4">
      {timeline.map((item, index) => (
        <div key={item.event} className="flex items-start">
          <div className="flex flex-col items-center mr-4">
            <div
              className={`w-4 h-4 rounded-full ${
                item.completed ? 'bg-success' : 'bg-gray-300'
              }`}
            />
            {index < timeline.length - 1 && (
              <div
                className={`w-0.5 h-12 mt-2 ${
                  item.completed ? 'bg-success' : 'bg-gray-300'
                }`}
              />
            )}
          </div>
          <div className="flex-1 pb-8">
            <h4 className={`font-semibold ${item.completed ? 'text-success' : 'text-gray-400'}`}>
              {item.label}
            </h4>
            {item.timestamp && (
              <p className="text-sm text-gray-500">
                {new Date(item.timestamp).toLocaleString(language)}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

