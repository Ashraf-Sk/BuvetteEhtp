import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { OrderStatus } from '../../types/order.types';
import { clsx } from 'clsx';

interface OrderStatusTrackerProps {
  status: OrderStatus;
}

const statusSteps: OrderStatus[] = ['confirmed', 'preparing', 'ready', 'completed'];

export const OrderStatusTracker: React.FC<OrderStatusTrackerProps> = ({ status }) => {
  const { t } = useTranslation();

  const getStatusLabel = (stepStatus: OrderStatus): string => {
    const labels: Record<OrderStatus, { fr: string; ar: string; en: string }> = {
      pending: { fr: 'En attente', ar: 'قيد الانتظار', en: 'Pending' },
      confirmed: { fr: 'Confirmée', ar: 'مؤكدة', en: 'Confirmed' },
      preparing: { fr: 'En préparation', ar: 'قيد التحضير', en: 'Preparing' },
      ready: { fr: 'Prête', ar: 'جاهزة', en: 'Ready' },
      completed: { fr: 'Terminée', ar: 'مكتملة', en: 'Completed' },
      cancelled: { fr: 'Annulée', ar: 'ملغاة', en: 'Cancelled' },
    };
    return labels[stepStatus][t('language') as 'fr' | 'ar' | 'en'] || labels[stepStatus].fr;
  };

  const currentStepIndex = statusSteps.indexOf(status);

  return (
    <div className="space-y-4">
      {statusSteps.map((step, index) => {
        const isCompleted = currentStepIndex >= index;
        const isCurrent = currentStepIndex === index && status !== 'completed';

        return (
          <div key={step} className="flex items-start">
            <div className="flex flex-col items-center mr-4">
              {isCompleted ? (
                <CheckCircle2 className="w-6 h-6 text-success" />
              ) : isCurrent ? (
                <Clock className="w-6 h-6 text-warning animate-pulse" />
              ) : (
                <Circle className="w-6 h-6 text-gray-300" />
              )}
              {index < statusSteps.length - 1 && (
                <div
                  className={clsx(
                    'w-0.5 h-12 mt-2',
                    isCompleted ? 'bg-success' : 'bg-gray-300'
                  )}
                />
              )}
            </div>
            <div className="flex-1 pb-8">
              <h4
                className={clsx(
                  'font-semibold',
                  isCompleted ? 'text-success' : isCurrent ? 'text-warning' : 'text-gray-400'
                )}
              >
                {getStatusLabel(step)}
              </h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

