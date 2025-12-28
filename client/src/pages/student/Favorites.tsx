import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useFavorites } from '../../hooks/useFavorites';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductModal } from '../../components/product/ProductModal';
import { Product } from '../../types/product.types';
import { Spinner } from '../../components/common/Spinner';
import { Heart } from 'lucide-react';
import { Button } from '../../components/common/Button';

export const Favorites: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { favorites, isLoading } = useFavorites();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const favoritesArray = Array.isArray(favorites) ? favorites : [];

  if (favoritesArray.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">{t('favorites.empty')}</h2>
          <p className="text-gray-500 mb-6">{t('favorites.empty_desc')}</p>
          <Button variant="primary" onClick={() => navigate('/menu')}>
            {t('favorites.view_menu')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('favorites.title')}</h1>
      <ProductGrid
        products={favoritesArray}
        onProductClick={setSelectedProduct}
      />
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

