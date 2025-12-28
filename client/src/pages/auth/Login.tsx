import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { LoginForm } from '../../components/auth/LoginForm';

export const Login: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={{
        backgroundImage: 'url(/ehtp.jpeg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Overlay pour améliorer la lisibilité */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white drop-shadow-lg">
            {t('auth.login')}
          </h2>
        </div>
        <div className="bg-white bg-opacity-95 py-8 px-6 shadow-2xl rounded-lg backdrop-blur-sm">
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

