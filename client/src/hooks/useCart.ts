import { useCartStore } from '../store/cartStore';
import { Product } from '../types/product.types';
import { toast } from 'react-hot-toast';

export const useCart = () => {
  const {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getTotal,
    getItemCount,
  } = useCartStore();

  const addToCart = (product: Product, quantity = 1) => {
    if (!product.isAvailable || product.stock < quantity) {
      toast.error('Produit non disponible en quantité suffisante');
      return;
    }
    addItem(product, quantity);
    toast.success('Produit ajouté au panier');
  };

  const removeFromCart = (productId: string) => {
    removeItem(productId);
    toast.success('Produit retiré du panier');
  };

  const updateItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  return {
    items,
    addToCart,
    removeFromCart,
    updateItemQuantity,
    clearCart,
    total: getTotal(),
    itemCount: getItemCount(),
  };
};

