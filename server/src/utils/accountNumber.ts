/**
 * Generates a Bank of Mahesh account number format: BM + 10 digits
 * e.g. BM5029182740
 */
export function generateAccountNumber(): string {
  const digits = Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join('');
  return `BM${digits}`;
}
