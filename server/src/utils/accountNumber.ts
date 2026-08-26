/**
 * Generates a Bank of AMR account number format: BA + 10 digits
 * e.g. BA5029182740
 */
export function generateAccountNumber(): string {
  const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  return `BA${digits}`;
}
