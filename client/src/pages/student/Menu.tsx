import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from '../../hooks/useTranslation';
import { useProducts } from '../../hooks/useProducts';
import { ProductGrid } from '../../components/product/ProductGrid';
import { ProductModal } from '../../components/product/ProductModal';
import { ProductFilters } from '../../components/product/ProductFilters';
import { Product } from '../../types/product.types';
import { Input } from '../../components/common/Input';
import { Search, Filter, Download } from 'lucide-react';
import api from '../../services/api';
import { useLanguageStore } from '../../store/languageStore';

export const Menu: React.FC = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState<any>({
    category: searchParams.get('category') ? [searchParams.get('category')] : undefined,
    search: searchParams.get('search') || '',
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const { data, isLoading } = useProducts(filters);
  const { language } = useLanguageStore();
  const [downloading, setDownloading] = useState(false);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setFilters({ ...filters, search: value || undefined });
  };

  const handleDownloadMenu = async () => {
    try {
      setDownloading(true);
      const response = await api.get('/menu/pdf', {
        params: { lang: language },
        responseType: 'blob',
      });

      // Create blob link to download
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `menu-buvette-ehtp-${language}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading menu:', error);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">{t('nav.menu')}</h1>
          <button
            onClick={handleDownloadMenu}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            <Download className="w-5 h-5" />
            {downloading ? t('menu.downloading') : t('menu.download')}
          </button>
        </div>
        
        {/* Search bar */}
        <div className="flex items-center space-x-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              placeholder={t('products.search')}
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="p-2 border rounded-lg hover:bg-gray-100"
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mb-6">
            <ProductFilters
              filters={filters}
              onFiltersChange={setFilters}
              onClose={() => setShowFilters(false)}
            />
          </div>
        )}
      </div>

      {/* Products Grid */}
      <ProductGrid
        products={data?.data || []}
        isLoading={isLoading}
        onProductClick={setSelectedProduct}
      />

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </div>
  );
};

