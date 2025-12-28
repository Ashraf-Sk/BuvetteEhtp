import { transporter, emailFrom } from '../config/email';

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export const sendEmail = async ({
  to,
  subject,
  html,
  text,
}: SendEmailOptions): Promise<void> => {
  if (!transporter) {
    console.warn(`⚠️  Email not configured - skipping email to ${to}`);
    console.log(`📧 Would send email to ${to}: ${subject}`);
    return; // Silently fail in development when email is not configured
  }

  try {
    await transporter.sendMail({
      from: emailFrom,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML for text version
    });
    console.log(`✅ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Error sending email:', error);
    throw new Error('Failed to send email');
  }
};

export const sendVerificationEmail = async (
  email: string,
  code: string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Vérification Email - Buvette EHTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4A7BA7;">Bienvenue à la Buvette EHTP!</h1>
          <p>Merci de vous être inscrit. Pour activer votre compte, veuillez utiliser le code de vérification suivant:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #4A7BA7; letter-spacing: 5px; font-size: 32px;">${code}</h2>
          </div>
          <p>Ce code est valable pendant 10 minutes.</p>
          <p>Si vous n'avez pas créé ce compte, veuillez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Buvette EHTP - École Hassania des Travaux Publics</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Vérification de votre email - Buvette EHTP',
    html,
  });
};

export const sendPasswordResetEmail = async (
  email: string,
  code: string
): Promise<void> => {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Réinitialisation Mot de Passe - Buvette EHTP</title>
      </head>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #4A7BA7;">Réinitialisation de votre mot de passe</h1>
          <p>Vous avez demandé à réinitialiser votre mot de passe. Utilisez le code suivant:</p>
          <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0;">
            <h2 style="color: #4A7BA7; letter-spacing: 5px; font-size: 32px;">${code}</h2>
          </div>
          <p>Ce code est valable pendant 10 minutes.</p>
          <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px;">© ${new Date().getFullYear()} Buvette EHTP - École Hassania des Travaux Publics</p>
        </div>
      </body>
    </html>
  `;

  await sendEmail({
    to: email,
    subject: 'Réinitialisation de votre mot de passe - Buvette EHTP',
    html,
  });
};

