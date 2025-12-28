import { MultiLangText } from './product.types';

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'completed' | 'cancelled';
export type PaymentMethod = 'cash' | 'card';
export type PaymentStatus = 'pending' | 'paid' | 'refunded';

export interface OrderItem {
  product: string;
  quantity: number;
  price: number;
  name: MultiLangText;
}

export interface Order {
  _id: string;
  orderNumber: string;
  qrCode: string;
  student: string;
  items: OrderItem[];
  totalAmount: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  estimatedTime?: number;
  completedAt?: string;
  notes?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderData {
  items: Array<{
    productId: string;
    quantity: number;
  }>;
  paymentMethod: PaymentMethod;
  notes?: string;
}

export interface CartItem {
  productId: string;
  product: any; // Product object
  quantity: number;
  price: number;
}

