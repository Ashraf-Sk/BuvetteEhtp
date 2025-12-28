import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

export const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('nav.dashboard')}</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Nouvelles commandes</h3>
          <p className="text-3xl font-bold text-primary">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">En préparation</h3>
          <p className="text-3xl font-bold text-warning">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Prêtes</h3>
          <p className="text-3xl font-bold text-success">0</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-gray-500 text-sm mb-2">Complétées aujourd'hui</h3>
          <p className="text-3xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
};

