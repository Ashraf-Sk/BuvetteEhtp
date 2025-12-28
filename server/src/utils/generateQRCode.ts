import QRCode from 'qrcode';

/**
 * Generates a QR code data URL for an order number
 */
export const generateQRCode = async (orderNumber: string): Promise<string> => {
  try {
    const dataUrl = await QRCode.toDataURL(orderNumber, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
      width: 300,
    } as any);
    return dataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw new Error('Failed to generate QR code');
  }
};

