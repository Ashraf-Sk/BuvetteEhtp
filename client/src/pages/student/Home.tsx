import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { ShoppingBag, Clock, Coffee } from 'lucide-react';

export const Home: React.FC = () => {
  const { t, language } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section with Background Image */}
      <section 
        className="relative min-h-[90vh] flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: 'url(/ehtp-buvette.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Overlay with gradient for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70"></div>
        <div className="absolute inset-0 bg-primary/20"></div>
        
        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Logo/Brand */}
          <div className="mb-6">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-4 drop-shadow-2xl">
              {t('home.hero_title') || 'Buvette EHTP'}
            </h1>
            <div className="w-24 h-1 bg-white mx-auto mb-6"></div>
          </div>

          {/* Main Slogan */}
          <p className="text-2xl md:text-4xl font-semibold mb-6 drop-shadow-lg">
            {t('home.hero_slogan') || 'Votre restauration, simplifiée'}
          </p>
          
          {/* Subtitle */}
          <p className="text-lg md:text-xl mb-10 max-w-3xl mx-auto drop-shadow-md text-gray-100">
            {t('home.hero_subtitle') || 'Commandez vos repas et boissons préférés depuis votre campus. Rapide, pratique et délicieux.'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
            <button 
              onClick={() => navigate('/menu')}
              className="flex items-center justify-center text-lg px-8 py-4 bg-white text-primary hover:bg-gray-100 font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg"
            >
              <ShoppingBag className="inline-block mr-2 w-5 h-5" />
              {t('home.cta_order') || 'Commander maintenant'}
            </button>
            <button 
              onClick={() => navigate('/menu')}
              className="flex items-center justify-center text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-primary font-semibold shadow-xl transform hover:scale-105 transition-all duration-200 rounded-lg"
            >
              <Coffee className="inline-block mr-2 w-5 h-5" />
              {t('home.cta_menu') || 'Voir le menu'}
            </button>
          </div>

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <Clock className="w-10 h-10 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg mb-2">Service Rapide</h3>
              <p className="text-sm text-gray-200">Livraison express sur le campus</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <ShoppingBag className="w-10 h-10 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg mb-2">Commandes Faciles</h3>
              <p className="text-sm text-gray-200">Interface intuitive et simple</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-6 border border-white/20">
              <Coffee className="w-10 h-10 mx-auto mb-3 text-white" />
              <h3 className="font-semibold text-lg mb-2">Produits Frais</h3>
              <p className="text-sm text-gray-200">Qualité garantie tous les jours</p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.categories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {PRODUCT_CATEGORIES.map((category) => (
              <div
                key={category.value}
                onClick={() => navigate(`/menu?category=${category.value}`)}
                className="bg-gray-100 rounded-lg p-8 text-center hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
              >
                {category.value === 'petit-dejeuner' && (
                  <img 
                    src="/Petit-dejenuer.jpeg" 
                    alt={category.label[language]}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {category.value === 'boissons' && (
                  <img 
                    src="/boissons.jpeg" 
                    alt={category.label[language]}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                {category.value === 'plats-chauds' && (
                  <img 
                    src="/platchaud.jpeg" 
                    alt={category.label[language]}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h3 className="text-2xl font-semibold mb-4">{category.label[language]}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">{t('home.how_it_works')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step1_title')}</h3>
              <p className="text-gray-600">{t('home.step1_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step2_title')}</h3>
              <p className="text-gray-600">{t('home.step2_desc')}</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">{t('home.step3_title')}</h3>
              <p className="text-gray-600">{t('home.step3_desc')}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

