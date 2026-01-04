import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { useTranslation } from '../../hooks/useTranslation';
import { useCart } from '../../hooks/useCart';
import { useCreateOrder } from '../../hooks/useOrders';
import { CartItem } from '../../components/cart/CartItem';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { PaymentMethod } from '../../types/order.types';
import { PaymentForm } from '../../components/payment/PaymentForm';
import { createPaymentIntent } from '../../services/payment.service';
import { STRIPE_PUBLISHABLE_KEY } from '../../utils/constants';
import toast from 'react-hot-toast';
import { CreditCard, Wallet } from 'lucide-react';

// Initialize Stripe
const stripePromise = STRIPE_PUBLISHABLE_KEY
  ? loadStripe(STRIPE_PUBLISHABLE_KEY)
  : null;

export const Checkout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { mutate: createOrder, isPending } = useCreateOrder();
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash');
  const [notes, setNotes] = useState('');
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [isLoadingPaymentIntent, setIsLoadingPaymentIntent] = useState(false);

  // Create payment intent when card payment is selected
  useEffect(() => {
    if (paymentMethod === 'card' && total > 0 && !clientSecret) {
      // Stripe minimum amount is 5 MAD
      const MINIMUM_AMOUNT = 5;
      if (total < MINIMUM_AMOUNT) {
        toast.error(`Le montant minimum pour un paiement par carte est de ${MINIMUM_AMOUNT} MAD. Veuillez utiliser le paiement en espèces.`);
        setPaymentMethod('cash');
        return;
      }

      setIsLoadingPaymentIntent(true);
      createPaymentIntent({ amount: total })
        .then((response) => {
          setClientSecret(response.data.clientSecret);
        })
        .catch((error) => {
          console.error('Error creating payment intent:', error);
          const errorMessage = error.response?.data?.message || 'Erreur lors de la création du paiement';
          toast.error(errorMessage);
          setPaymentMethod('cash');
        })
        .finally(() => {
          setIsLoadingPaymentIntent(false);
        });
    }
  }, [paymentMethod, total, clientSecret]);

  const handleCashSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder(
      {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: 'cash',
        notes: notes || undefined,
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/orders/${order._id}/track`);
        },
      }
    );
  };

  const handleCardPaymentSuccess = (paymentIntentId: string) => {
    createOrder(
      {
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        paymentMethod: 'card',
        notes: notes || undefined,
        paymentIntentId,
      },
      {
        onSuccess: (order) => {
          clearCart();
          navigate(`/orders/${order._id}/track`);
        },
      }
    );
  };

  const handleCardPaymentError = (error: string) => {
    console.error('Payment error:', error);
    toast.error(error);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">{t('checkout.title')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Order items */}
          <div className="bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-semibold p-4 border-b">
              {t('checkout.order_summary')}
            </h2>
            {items.map((item) => (
              <CartItem key={item.productId} item={item} />
            ))}
          </div>

          {/* Payment method */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">
              {t('cart.payment_method')}
            </h2>
            <div className="space-y-3">
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={() => setPaymentMethod('cash')}
                  className="mr-3"
                />
                <Wallet className="w-5 h-5 mr-2 text-primary" />
                <span className="font-medium">{t('cart.cash')}</span>
              </label>
              <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="payment"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="mr-3"
                />
                <CreditCard className="w-5 h-5 mr-2 text-primary" />
                <span className="font-medium">
                  {t('cart.card')} (Visa, Mastercard)
                </span>
              </label>
            </div>
          </div>

          {/* Payment form for card */}
          {paymentMethod === 'card' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              {isLoadingPaymentIntent ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-3">Chargement du formulaire de paiement...</span>
                </div>
              ) : clientSecret && stripePromise ? (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <PaymentForm
                    amount={total}
                    clientSecret={clientSecret}
                    onSuccess={handleCardPaymentSuccess}
                    onError={handleCardPaymentError}
                  />
                </Elements>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  Erreur lors du chargement du formulaire de paiement
                </div>
              )}
            </div>
          )}

          {/* Notes */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <Input
              label="Notes (optionnel)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instructions spéciales..."
            />
          </div>
        </div>

        {/* Summary */}
        <div>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
            <h2 className="text-xl font-semibold mb-4">
              {t('checkout.order_summary')}
            </h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between">
                <span>{t('common.subtotal')}</span>
                <span>{total.toFixed(2)} MAD</span>
              </div>
              <div className="border-t pt-3 flex justify-between text-lg font-bold">
                <span>{t('common.total')}</span>
                <span className="text-primary">{total.toFixed(2)} MAD</span>
              </div>
            </div>
            {paymentMethod === 'cash' && (
              <Button
                type="button"
                variant="primary"
                className="w-full"
                onClick={handleCashSubmit}
                isLoading={isPending}
              >
                {t('cart.checkout')}
              </Button>
            )}
            {paymentMethod === 'card' && (
              <div className="text-sm text-gray-500 text-center">
                Utilisez le formulaire de paiement ci-dessus pour finaliser votre commande
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
