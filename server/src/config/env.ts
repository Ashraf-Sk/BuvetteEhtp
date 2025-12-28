import dotenv from 'dotenv';

dotenv.config();

interface EnvConfig {
  NODE_ENV: string;
  PORT: number;
  MONGODB_URI: string;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: string;
  EMAIL_HOST?: string;
  EMAIL_PORT?: number;
  EMAIL_USER?: string;
  EMAIL_PASS?: string;
  EMAIL_FROM?: string;
  CLOUDINARY_CLOUD_NAME?: string;
  CLOUDINARY_API_KEY?: string;
  CLOUDINARY_API_SECRET?: string;
  CMI_MERCHANT_ID?: string;
  CMI_SECRET_KEY?: string;
  CMI_API_URL?: string;
  CLIENT_URL: string;
  VAPID_PUBLIC_KEY?: string;
  VAPID_PRIVATE_KEY?: string;
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue || '';
}

const isDevelopment = process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;

export const env: EnvConfig = {
  NODE_ENV: getEnvVar('NODE_ENV', 'development'),
  PORT: parseInt(getEnvVar('PORT', '5000'), 10),
  MONGODB_URI: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/buvette-ehtp'),
  JWT_SECRET: getEnvVar('JWT_SECRET'),
  JWT_EXPIRES_IN: getEnvVar('JWT_EXPIRES_IN', '7d'),
  // Email is optional in development
  EMAIL_HOST: isDevelopment ? process.env.EMAIL_HOST || undefined : getEnvVar('EMAIL_HOST'),
  EMAIL_PORT: isDevelopment 
    ? (process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT, 10) : undefined)
    : parseInt(getEnvVar('EMAIL_PORT', '587'), 10),
  EMAIL_USER: isDevelopment ? process.env.EMAIL_USER || undefined : getEnvVar('EMAIL_USER'),
  EMAIL_PASS: isDevelopment ? process.env.EMAIL_PASS || undefined : getEnvVar('EMAIL_PASS'),
  EMAIL_FROM: isDevelopment 
    ? process.env.EMAIL_FROM || 'noreply@buvette-ehtp.ac.ma'
    : getEnvVar('EMAIL_FROM', 'noreply@buvette-ehtp.ac.ma'),
  // Cloudinary is optional in development
  CLOUDINARY_CLOUD_NAME: isDevelopment 
    ? process.env.CLOUDINARY_CLOUD_NAME || undefined
    : getEnvVar('CLOUDINARY_CLOUD_NAME'),
  CLOUDINARY_API_KEY: isDevelopment 
    ? process.env.CLOUDINARY_API_KEY || undefined
    : getEnvVar('CLOUDINARY_API_KEY'),
  CLOUDINARY_API_SECRET: isDevelopment 
    ? process.env.CLOUDINARY_API_SECRET || undefined
    : getEnvVar('CLOUDINARY_API_SECRET'),
  CMI_MERCHANT_ID: process.env.CMI_MERCHANT_ID || undefined,
  CMI_SECRET_KEY: process.env.CMI_SECRET_KEY || undefined,
  CMI_API_URL: process.env.CMI_API_URL || undefined,
  CLIENT_URL: getEnvVar('CLIENT_URL', 'http://localhost:5173'),
  VAPID_PUBLIC_KEY: process.env.VAPID_PUBLIC_KEY || undefined,
  VAPID_PRIVATE_KEY: process.env.VAPID_PRIVATE_KEY || undefined,
};
