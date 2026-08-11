/**
 * Monetary utilities handling integer paise conversions to prevent floating point inaccuracy.
 * 1 INR = 100 Paise
 */

export function inrToPaise(rupees: number): number {
  if (isNaN(rupees) || rupees < 0) return 0;
  return Math.round(rupees * 100);
}

export function paiseToINR(paise: number): number {
  if (isNaN(paise)) return 0;
  return paise / 100;
}

export function formatINR(paise: number): string {
  const rupees = paiseToINR(paise);
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rupees);
}

export function isValidAmount(paise: number): boolean {
  return Number.isInteger(paise) && paise > 0;
}
