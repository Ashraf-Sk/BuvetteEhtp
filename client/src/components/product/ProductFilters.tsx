import React from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '../../hooks/useTranslation';
import { ProductFilters as ProductFiltersType, ProductCategory } from '../../types/product.types';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

interface ProductFiltersProps {
  filters: ProductFiltersType;
  onFiltersChange: (filters: ProductFiltersType) => void;
  onClose?: () => void;
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  onClose,
}) => {
  const { t, language } = useTranslation();

  const handleCategoryToggle = (category: ProductCategory) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(category)
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category];
    
    onFiltersChange({ ...filters, category: newCategories });
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    onFiltersChange({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const handleSortChange = (sortBy: string, sortOrder: 'asc' | 'desc') => {
    onFiltersChange({
      ...filters,
      sortBy: sortBy as any,
      sortOrder,
    });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {onClose && (
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{t('products.filter')}</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Categories */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('products.category')}
        </label>
        <div className="space-y-2">
          {PRODUCT_CATEGORIES.map((cat) => (
            <label key={cat.value} className="flex items-center">
              <input
                type="checkbox"
                checked={filters.category?.includes(cat.value as ProductCategory) || false}
                onChange={() => handleCategoryToggle(cat.value as ProductCategory)}
                className="mr-2"
              />
              <span>{cat.label[language]}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('products.price_range')}
        </label>
        <div className="grid grid-cols-2 gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              handlePriceRangeChange(
                e.target.value ? Number(e.target.value) : undefined,
                filters.maxPrice
              )
            }
          />
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              handlePriceRangeChange(
                filters.minPrice,
                e.target.value ? Number(e.target.value) : undefined
              )
            }
          />
        </div>
      </div>

      {/* Sort */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('products.sort_by')}
        </label>
        <select
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          value={`${filters.sortBy || 'createdAt'}-${filters.sortOrder || 'desc'}`}
          onChange={(e) => {
            const [sortBy, sortOrder] = e.target.value.split('-');
            handleSortChange(sortBy, sortOrder as 'asc' | 'desc');
          }}
        >
          <option value="createdAt-desc">{t('products.sort_newest')}</option>
          <option value="price-asc">{t('products.sort_price_asc')}</option>
          <option value="price-desc">{t('products.sort_price_desc')}</option>
          <option value="averageRating-desc">{t('products.sort_popular')}</option>
        </select>
      </div>

      {/* Clear filters */}
      <Button variant="outline" onClick={clearFilters} className="w-full">
        {t('common.clear')}
      </Button>
    </div>
  );
};

