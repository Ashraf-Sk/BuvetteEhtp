export interface MultiLangText {
  fr: string;
  ar: string;
  en: string;
}

export type ProductCategory = 'petit-dejeuner' | 'plats-chauds' | 'boissons';

export interface Product {
  _id: string;
  name: MultiLangText;
  description: MultiLangText;
  price: number;
  category: ProductCategory;
  image: string;
  isAvailable: boolean;
  stock: number;
  preparationTime: number;
  isPopular: boolean;
  averageRating: number;
  totalReviews: number;
  nutritionalInfo?: {
    calories?: number;
    allergens?: string[];
  };
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: ProductCategory[];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
  isAvailable?: boolean;
  isPopular?: boolean;
  sortBy?: 'createdAt' | 'price' | 'averageRating';
  sortOrder?: 'asc' | 'desc';
}

