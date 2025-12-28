import nodemailer from 'nodemailer';
import { env } from './env';

// Check if email is configured
const isEmailConfigured = env.EMAIL_HOST && env.EMAIL_USER && env.EMAIL_PASS;

export const transporter = isEmailConfigured
  ? nodemailer.createTransport({
      host: env.EMAIL_HOST,
      port: env.EMAIL_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
      },
    })
  : null;

// Verify connection configuration only if email is configured
if (transporter) {
  transporter.verify((error) => {
    if (error) {
      console.error('❌ Email transporter error:', error);
      console.warn('⚠️  Email functionality will be disabled');
    } else {
      console.log('✅ Email transporter ready');
    }
  });
} else {
  console.warn('⚠️  Email not configured - email functionality disabled');
  console.log('💡 To enable email, set EMAIL_HOST, EMAIL_USER, and EMAIL_PASS in .env');
}

export const emailFrom = env.EMAIL_FROM || 'noreply@buvette-ehtp.ac.ma';

