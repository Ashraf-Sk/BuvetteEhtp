import React, { useState, useEffect } from 'react';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { CreditCard, Loader2 } from 'lucide-react';
import { Button } from '../common/Button';
import toast from 'react-hot-toast';

interface PaymentFormProps {
  amount: number;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
  clientSecret: string;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  amount,
  onSuccess,
  onError,
  clientSecret,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [hasAttemptedPayment, setHasAttemptedPayment] = useState(false);

  useEffect(() => {
    if (!stripe || !clientSecret || hasAttemptedPayment) {
      return;
    }

    // Only check status for already processed payments (not new ones)
    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      // Only show messages for payments that have already been processed
      // Don't show error for 'requires_payment_method' on initial load (normal state)
      if (paymentIntent?.status === 'succeeded') {
        setMessage('Payment succeeded!');
      } else if (paymentIntent?.status === 'processing') {
        setMessage('Your payment is processing.');
      }
      // Don't show message for 'requires_payment_method' - it's the default state
    });
  }, [stripe, clientSecret, hasAttemptedPayment]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setMessage(null);
    setHasAttemptedPayment(true);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders`,
        },
        redirect: 'if_required',
      });

      if (error) {
        onError(error.message || 'An error occurred');
        setMessage(error.message || 'Votre paiement a échoué, veuillez réessayer.');
        toast.error(error.message || 'Paiement échoué');
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        setMessage('Paiement réussi !');
        toast.success('Paiement réussi !');
      } else if (paymentIntent?.status === 'processing') {
        setMessage('Votre paiement est en cours de traitement...');
      } else if (paymentIntent?.status === 'requires_payment_method') {
        setMessage('Votre paiement a échoué, veuillez réessayer.');
      }
    } catch (err: any) {
      const errorMessage = err.message || 'Une erreur est survenue';
      onError(errorMessage);
      setMessage(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center mb-4">
          <CreditCard className="w-5 h-5 mr-2 text-primary" />
          <h3 className="text-lg font-semibold">Informations de paiement</h3>
        </div>
        <PaymentElement
          options={{
            layout: 'tabs',
          }}
        />
      </div>

      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes('succeeded')
              ? 'bg-green-50 text-green-800'
              : 'bg-red-50 text-red-800'
          }`}
        >
          {message}
        </div>
      )}

      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
        <span className="text-lg font-semibold">Total à payer:</span>
        <span className="text-2xl font-bold text-primary">
          {amount.toFixed(2)} MAD
        </span>
      </div>

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        disabled={!stripe || !elements || isProcessing}
        isLoading={isProcessing}
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            Traitement en cours...
          </>
        ) : (
          <>
            <CreditCard className="w-5 h-5 mr-2" />
            Payer {amount.toFixed(2)} MAD
          </>
        )}
      </Button>

      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
        <div className="flex items-center space-x-3">
          <img
            src="/visa-logo.png"
            alt="Visa"
            className="h-8 object-contain"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          <img
            src="/Visa-Card-Logo.png"
            alt="Visa Card"
            className="h-8 object-contain"
            onError={(e) => {
              // Fallback si l'image ne charge pas
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
        <span>Paiement sécurisé par Stripe</span>
      </div>
    </form>
  );
};

