import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { Order } from '../../types/order.types';
import { CheckCircle, Clock, Package, CheckCircle2 } from 'lucide-react';

interface OrderProgressProps {
  order: Order;
}

export const OrderProgress: React.FC<OrderProgressProps> = ({ order }) => {
  const { t, language } = useTranslation();

  const steps = [
    {
      key: 'pending',
      label: t('orders.status_pending') || 'En attente',
      icon: Clock,
      completed: ['pending', 'confirmed', 'preparing', 'ready', 'completed'].includes(order.status),
      active: order.status === 'pending',
    },
    {
      key: 'confirmed',
      label: t('orders.status_confirmed') || 'Confirmée',
      icon: CheckCircle,
      completed: ['confirmed', 'preparing', 'ready', 'completed'].includes(order.status),
      active: order.status === 'confirmed',
    },
    {
      key: 'preparing',
      label: t('orders.status_preparing') || 'En préparation',
      icon: Package,
      completed: ['preparing', 'ready', 'completed'].includes(order.status),
      active: order.status === 'preparing',
    },
    {
      key: 'ready',
      label: t('orders.status_ready') || 'Prête',
      icon: CheckCircle2,
      completed: ['ready', 'completed'].includes(order.status),
      active: order.status === 'ready',
    },
    {
      key: 'completed',
      label: t('orders.status_completed') || 'Terminée',
      icon: CheckCircle2,
      completed: order.status === 'completed',
      active: order.status === 'completed',
    },
  ];

  const getStepColor = (step: typeof steps[0]) => {
    if (step.completed) {
      return 'text-success border-success bg-success/10';
    }
    if (step.active) {
      return 'text-primary border-primary bg-primary/10';
    }
    return 'text-gray-400 border-gray-300 bg-gray-50';
  };

  const getProgressPercentage = () => {
    const completedSteps = steps.filter(s => s.completed).length;
    return (completedSteps / steps.length) * 100;
  };

  return (
    <div className="mt-4">
      {/* Progress Bar */}
      <div className="relative mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-600">
            {t('orders.progress') || 'Progression'}
          </span>
          <span className="text-xs font-medium text-primary">
            {Math.round(getProgressPercentage())}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isLast = index === steps.length - 1;
          
          return (
            <React.Fragment key={step.key}>
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${getStepColor(step)}`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span
                  className={`text-xs mt-2 text-center ${
                    step.completed || step.active
                      ? 'text-gray-900 font-medium'
                      : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {!isLast && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    step.completed ? 'bg-success' : 'bg-gray-200'
                  }`}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

