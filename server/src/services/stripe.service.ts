import Stripe from 'stripe';
import { env } from '../config/env';

if (!env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not configured');
}

export const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: '2025-12-15.clover',
});

export interface CreatePaymentIntentParams {
  amount: number; // Amount in cents
  currency?: string;
  metadata?: Record<string, string>;
}

export const createPaymentIntent = async (
  params: CreatePaymentIntentParams
): Promise<Stripe.PaymentIntent> => {
  const { amount, currency = 'mad', metadata = {} } = params;

  // Stripe supports MAD (Moroccan Dirham)
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100), // Convert to cents (MAD uses cents)
    currency: currency.toLowerCase(),
    payment_method_types: ['card'], // Only card payments (Visa, Mastercard)
    metadata,
  });

  return paymentIntent;
};

export const confirmPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
  if (paymentIntent.status === 'succeeded') {
    return paymentIntent;
  }

  return paymentIntent;
};

export const getPaymentIntent = async (
  paymentIntentId: string
): Promise<Stripe.PaymentIntent> => {
  return await stripe.paymentIntents.retrieve(paymentIntentId);
};

