import { useTranslation as useI18nTranslation } from 'react-i18next';
import { useLanguageStore } from '../store/languageStore';

export const useTranslation = () => {
  const { t, i18n } = useI18nTranslation();
  const { language, setLanguage } = useLanguageStore();

  const changeLanguage = (lang: 'fr' | 'ar' | 'en') => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  return {
    t,
    language,
    changeLanguage,
    isRTL: language === 'ar',
  };
};

