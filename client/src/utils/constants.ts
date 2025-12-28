export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';
export const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY || '';

export const PRODUCT_CATEGORIES = [
  { value: 'petit-dejeuner', label: { fr: 'Petit-Déjeuner', ar: 'فطور', en: 'Breakfast' } },
  { value: 'plats-chauds', label: { fr: 'Plats Chauds', ar: 'أطباق ساخنة', en: 'Hot Meals' } },
  { value: 'boissons', label: { fr: 'Boissons', ar: 'مشروبات', en: 'Beverages' } },
] as const;

export const ORDER_STATUSES = {
  pending: { fr: 'En attente', ar: 'قيد الانتظار', en: 'Pending' },
  confirmed: { fr: 'Confirmée', ar: 'مؤكدة', en: 'Confirmed' },
  preparing: { fr: 'En préparation', ar: 'قيد التحضير', en: 'Preparing' },
  ready: { fr: 'Prête', ar: 'جاهزة', en: 'Ready' },
  completed: { fr: 'Terminée', ar: 'مكتملة', en: 'Completed' },
  cancelled: { fr: 'Annulée', ar: 'ملغاة', en: 'Cancelled' },
} as const;

