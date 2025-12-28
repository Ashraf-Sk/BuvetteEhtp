import { env } from '../config/env';
import crypto from 'crypto';

interface CMIPaymentParams {
  amount: number;
  orderId: string;
  clientName: string;
  clientEmail: string;
  returnUrl: string;
}

export const createCMIPaymentUrl = (params: CMIPaymentParams): string => {
  if (!env.CMI_MERCHANT_ID || !env.CMI_SECRET_KEY || !env.CMI_API_URL) {
    throw new Error('CMI payment gateway not configured');
  }

  const { amount, orderId, clientName, clientEmail, returnUrl } = params;

  // CMI payment parameters
  const paymentParams: any = {
    amount: amount.toFixed(2),
    currency: '504', // MAD
    oid: orderId,
    okUrl: returnUrl,
    failUrl: returnUrl,
    shopurl: env.CLIENT_URL,
    rnd: Date.now().toString(),
    storetype: '3D_PAY_HOSTING',
    trantype: 'Auth',
    lang: 'fr',
    hashAlgorithm: 'ver3',
    encoding: 'UTF-8',
    email: clientEmail,
    BillToName: clientName,
  };

  // Generate hash
  const hashString = `${env.CMI_MERCHANT_ID}${paymentParams.oid}${paymentParams.amount}${paymentParams.okUrl}${paymentParams.failUrl}${paymentParams.trantype}${paymentParams.rnd}${env.CMI_SECRET_KEY}`;
  paymentParams.hash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('base64');

  // Build URL with parameters
  const queryString = new URLSearchParams(paymentParams).toString();
  return `${env.CMI_API_URL}?${queryString}`;
};

export const verifyCMICallback = (params: any): boolean => {
  if (!env.CMI_SECRET_KEY) {
    return false;
  }

  const { HASH, AMOUNT, OID, HASH_RND } = params;
  const hashString = `${env.CMI_SECRET_KEY}${OID}${AMOUNT}${HASH_RND}`;
  const calculatedHash = crypto
    .createHash('sha512')
    .update(hashString)
    .digest('base64');

  return calculatedHash === HASH;
};

