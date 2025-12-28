/**
 * Generates a unique order number in format: EHYYYY-XXXX
 * Example: EH2025-0123
 */
export const generateOrderNumber = (): string => {
  const year = new Date().getFullYear();
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  return `EH${year}-${randomNum}`;
};

