import React from 'react';
import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from '../../store/languageStore';
import { clsx } from 'clsx';

export const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();
  const { setLanguage } = useLanguageStore();

  const languages = [
    { code: 'fr', label: 'FR', name: 'Français' },
    { code: 'ar', label: 'AR', name: 'العربية' },
    { code: 'en', label: 'EN', name: 'English' },
  ];

  const handleLanguageChange = (lang: 'fr' | 'ar' | 'en') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return (
    <div className="relative group">
      <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors">
        <Globe className="w-5 h-5 text-gray-600" />
        <span className="font-medium">{i18n.language.toUpperCase()}</span>
      </button>
      <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code as 'fr' | 'ar' | 'en')}
            className={clsx(
              'w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg transition-colors',
              i18n.language === lang.code && 'bg-primary/10 text-primary font-medium'
            )}
          >
            {lang.label} - {lang.name}
          </button>
        ))}
      </div>
    </div>
  );
};

