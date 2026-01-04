import React, { useState } from 'react';
import { useTranslation } from '../../hooks/useTranslation';
import { 
  useEmployeeProducts, 
  useCreateProduct, 
  useUpdateProduct, 
  useDeleteProduct,
  useUpdateStock 
} from '../../hooks/useEmployee';
import { Product } from '../../types/product.types';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Spinner } from '../../components/common/Spinner';
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { PRODUCT_CATEGORIES } from '../../utils/constants';
import toast from 'react-hot-toast';

const ProductForm: React.FC<{
  product?: Product;
  onClose: () => void;
  onSubmit: (product: Partial<Product>) => void;
  isSubmitting: boolean;
}> = ({ product, onClose, onSubmit, isSubmitting }) => {
  const { t, language } = useTranslation();
  const [formData, setFormData] = useState({
    name: {
      fr: product?.name?.fr || '',
      ar: product?.name?.ar || '',
      en: product?.name?.en || '',
    },
    description: {
      fr: product?.description?.fr || '',
      ar: product?.description?.ar || '',
      en: product?.description?.en || '',
    },
    price: product?.price || 0,
            category: (product?.category || 'petit-dejeuner') as 'petit-dejeuner' | 'plats-chauds' | 'boissons',
    stock: product?.stock || 0,
    preparationTime: product?.preparationTime || 5,
    isAvailable: product?.isAvailable ?? true,
    isPopular: product?.isPopular ?? false,
    image: product?.image || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.fr || !formData.name.ar || !formData.name.en) {
      toast.error('Le nom du produit est requis dans toutes les langues');
      return;
    }
    if (formData.price <= 0) {
      toast.error('Le prix doit être supérieur à 0');
      return;
    }
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nom (FR) *</label>
          <Input
            value={formData.name.fr}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, fr: e.target.value } })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom (AR) *</label>
          <Input
            value={formData.name.ar}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Nom (EN) *</label>
          <Input
            value={formData.name.en}
            onChange={(e) => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Prix (MAD) *</label>
          <Input
            type="number"
            step="0.01"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Catégorie *</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value as 'petit-dejeuner' | 'plats-chauds' | 'boissons' })}
            required
          >
            {PRODUCT_CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label[language]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Stock *</label>
          <Input
            type="number"
            min="0"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Temps de préparation (min)</label>
          <Input
            type="number"
            min="1"
            value={formData.preparationTime}
            onChange={(e) => setFormData({ ...formData, preparationTime: parseInt(e.target.value) || 5 })}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <Input
          type="url"
          value={formData.image}
          onChange={(e) => setFormData({ ...formData, image: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isAvailable}
            onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm">Disponible</span>
        </label>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={formData.isPopular}
            onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
            className="mr-2"
          />
          <span className="text-sm">Populaire</span>
        </label>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          {t('common.cancel')}
        </Button>
        <Button type="submit" variant="primary" isLoading={isSubmitting}>
          {product ? t('common.save') : 'Créer'}
        </Button>
      </div>
    </form>
  );
};

export const Inventory: React.FC = () => {
  const { t, language } = useTranslation();
  const { data: products = [], isLoading } = useEmployeeProducts();
  const { mutate: createProduct, isPending: isCreating } = useCreateProduct();
  const { mutate: updateProduct, isPending: isUpdating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();
  const { mutate: updateStock } = useUpdateStock();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [stockEditId, setStockEditId] = useState<string | null>(null);
  const [stockValue, setStockValue] = useState<number>(0);

  const handleCreate = (productData: Partial<Product>) => {
    createProduct(productData, {
      onSuccess: () => {
        setIsModalOpen(false);
        setEditingProduct(null);
      },
    });
  };

  const handleUpdate = (productData: Partial<Product>) => {
    if (!editingProduct) return;
    updateProduct(
      { id: editingProduct._id, product: productData },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setEditingProduct(null);
        },
      }
    );
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('common.confirm_delete') || 'Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      deleteProduct(id);
    }
  };

  const handleStockUpdate = (id: string, currentStock: number) => {
    setStockEditId(id);
    setStockValue(currentStock);
  };

  const confirmStockUpdate = (id: string) => {
    updateStock(
      { id, stock: stockValue },
      {
        onSuccess: () => {
          setStockEditId(null);
        },
      }
    );
  };

  const lowStockProducts = products.filter((p) => p.stock <= 5 && p.stock > 0);
  const outOfStockProducts = products.filter((p) => p.stock === 0);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">{t('employee.inventory') || 'Inventaire'}</h1>
          <p className="text-gray-600">
            {t('employee.inventory_desc') || 'Gérez vos produits et leur stock'}
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => {
            setEditingProduct(null);
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('employee.add_product') || 'Ajouter un produit'}
        </Button>
      </div>

      {/* Alerts */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="mb-6 space-y-2">
          {lowStockProducts.length > 0 && (
            <div className="bg-warning/10 border border-warning text-warning px-4 py-3 rounded-lg flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2" />
              <span>
                {lowStockProducts.length} {t('employee.low_stock_products') || 'produits en stock faible'}
              </span>
            </div>
          )}
          {outOfStockProducts.length > 0 && (
            <div className="bg-error/10 border border-error text-error px-4 py-3 rounded-lg flex items-center">
              <XCircle className="w-5 h-5 mr-2" />
              <span>
                {outOfStockProducts.length} {t('employee.out_of_stock_products') || 'produits en rupture de stock'}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-1">{product.name[language]}</h3>
                <p className="text-sm text-gray-500 mb-2">
                  {PRODUCT_CATEGORIES.find((c) => c.value === product.category)?.label[language]}
                </p>
                <div className="flex items-center gap-2 mb-2">
                  {product.isAvailable ? (
                    <Badge variant="success">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {t('products.available')}
                    </Badge>
                  ) : (
                    <Badge variant="error">
                      <XCircle className="w-3 h-3 mr-1" />
                      {t('products.out_of_stock')}
                    </Badge>
                  )}
                  {product.isPopular && (
                    <Badge variant="default">{t('products.popular')}</Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">{t('common.price')}:</span>
                <span className="font-semibold">{product.price.toFixed(2)} MAD</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">{t('employee.stock') || 'Stock'}:</span>
                {stockEditId === product._id ? (
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      min="0"
                      value={stockValue}
                      onChange={(e) => setStockValue(parseInt(e.target.value) || 0)}
                      className="w-20"
                    />
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => confirmStockUpdate(product._id)}
                    >
                      {t('common.save')}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setStockEditId(null)}
                    >
                      {t('common.cancel')}
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        product.stock === 0
                          ? 'text-error'
                          : product.stock <= 5
                          ? 'text-warning'
                          : 'text-success'
                      }`}
                    >
                      {product.stock}
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleStockUpdate(product._id, product.stock)}
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditingProduct(product);
                  setIsModalOpen(true);
                }}
              >
                <Edit className="w-4 h-4 mr-1" />
                {t('common.edit')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(product._id)}
                className="text-error border-error hover:bg-error/10"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                {t('common.delete')}
              </Button>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
          <p className="text-gray-500 text-lg mb-4">
            {t('employee.no_products') || 'Aucun produit'}
          </p>
          <Button variant="primary" onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            {t('employee.add_first_product') || 'Ajouter le premier produit'}
          </Button>
        </div>
      )}

      {/* Product Form Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingProduct(null);
        }}
        title={editingProduct ? t('employee.edit_product') || 'Modifier le produit' : t('employee.add_product') || 'Ajouter un produit'}
      >
        <ProductForm
          product={editingProduct || undefined}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
          onSubmit={editingProduct ? handleUpdate : handleCreate}
          isSubmitting={isCreating || isUpdating}
        />
      </Modal>
    </div>
  );
};
