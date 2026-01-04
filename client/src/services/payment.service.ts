import api from './api';

export interface CreatePaymentIntentData {
  amount: number;
  orderId?: string;
}

export interface PaymentIntentResponse {
  success: boolean;
  data: {
    clientSecret: string;
    paymentIntentId: string;
  };
}

export interface PaymentStatusResponse {
  success: boolean;
  data: {
    status: string;
    amount: number;
    currency: string;
  };
}

export const createPaymentIntent = async (
  data: CreatePaymentIntentData
): Promise<PaymentIntentResponse> => {
  const response = await api.post<PaymentIntentResponse>(
    '/payment/create-intent',
    data
  );
  return response.data;
};

export const getPaymentStatus = async (
  paymentIntentId: string
): Promise<PaymentStatusResponse> => {
  const response = await api.get<PaymentStatusResponse>(
    `/payment/status/${paymentIntentId}`
  );
  return response.data;
};

