import React from 'react';
import { AlertCircle, CheckCircle, Info, X, XCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface AlertProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  message,
  onClose,
  className,
}) => {
  const variants = {
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      text: 'text-success',
      icon: CheckCircle,
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error',
      text: 'text-error',
      icon: XCircle,
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      text: 'text-warning',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-info/10',
      border: 'border-info',
      text: 'text-info',
      icon: Info,
    },
  };

  const variant = variants[type];
  const Icon = variant.icon;

  return (
    <div
      className={clsx(
        'border rounded-lg p-4',
        variant.bg,
        variant.border,
        className
      )}
      role="alert"
    >
      <div className="flex items-start">
        <Icon className={clsx('w-5 h-5 mt-0.5', variant.text)} />
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={clsx('font-semibold mb-1', variant.text)}>{title}</h3>
          )}
          <p className={clsx('text-sm', variant.text)}>{message}</p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={clsx('ml-4 p-1 rounded hover:bg-opacity-20', variant.text)}
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

