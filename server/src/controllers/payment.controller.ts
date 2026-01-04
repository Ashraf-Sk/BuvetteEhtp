import { Request, Response, NextFunction } from 'express';
import { createPaymentIntent, getPaymentIntent, stripe } from '../services/stripe.service';
import { env } from '../config/env';
import { ValidationError } from '../utils/errorHandler';
import Stripe from 'stripe';

export const createStripePaymentIntent = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { amount, orderId } = req.body;
    const userId = req.user!._id;

    if (!amount || amount <= 0) {
      throw new ValidationError('Amount must be greater than 0');
    }

    // Stripe minimum amount for MAD is 5 MAD (equivalent to ~0.50 USD)
    const MINIMUM_AMOUNT_MAD = 5;
    if (amount < MINIMUM_AMOUNT_MAD) {
      throw new ValidationError(
        `Le montant minimum pour un paiement par carte est de ${MINIMUM_AMOUNT_MAD} MAD. Veuillez utiliser le paiement en espèces pour les montants inférieurs.`
      );
    }

    if (!env.STRIPE_SECRET_KEY) {
      throw new Error('Stripe is not configured');
    }

    const paymentIntent = await createPaymentIntent({
      amount,
      currency: 'mad',
      metadata: {
        userId: userId.toString(),
        orderId: orderId || '',
      },
    });

    res.status(200).json({
      success: true,
      data: {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getStripePaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentIntentId } = req.params;

    if (!paymentIntentId) {
      throw new ValidationError('Payment intent ID is required');
    }

    const paymentIntent = await getPaymentIntent(paymentIntentId);

    res.status(200).json({
      success: true,
      data: {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100, // Convert from cents
        currency: paymentIntent.currency,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const handleStripeWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const sig = req.headers['stripe-signature'];

    if (!sig || !env.STRIPE_WEBHOOK_SECRET) {
      res.status(400).send('Webhook signature missing');
      return;
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        // Handle successful payment
        console.log('PaymentIntent succeeded:', paymentIntent.id);
        break;
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object as Stripe.PaymentIntent;
        // Handle failed payment
        console.log('PaymentIntent failed:', failedPayment.id);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    next(error);
  }
};

