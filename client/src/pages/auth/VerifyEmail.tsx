import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { useAuth } from '../../hooks/useAuth';
import { VerificationCodeInput } from '../../components/auth/VerificationCodeInput';

export const VerifyEmail: React.FC = () => {
  const { t } = useTranslation();
  const { verifyEmail, user } = useAuth();
  const [email] = useState(user?.email || localStorage.getItem('verifyEmail') || '');

  const handleVerify = (verifiedCode: string) => {
    verifyEmail({ email, code: verifiedCode });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t('auth.verify_email')}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t('auth.code_sent')} {email}
          </p>
        </div>
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <VerificationCodeInput onComplete={handleVerify} />
        </div>
      </div>
    </div>
  );
};

