import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { ResetPasswordForm } from '../../components/auth/ResetPasswordForm';

export const ForgotPassword: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.reset_password')}
          </h2>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  );
};

