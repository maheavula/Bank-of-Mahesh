/**
 * Formats integer paise to Indian Rupee (INR) representation.
 * e.g., 12500050 -> ₹1,25,000.50
 */
export function formatINR(paise: number): string {
  if (isNaN(paise)) return '₹0.00';
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rupees);
}

export function formatDate(isoString: string): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).format(date);
}

export function formatShortDate(isoString: string): string {
  if (!isoString) return 'N/A';
  const date = new Date(isoString);
  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short'
  }).format(date);
}

export function maskAccountNumber(accNumber?: string): string {
  if (!accNumber) return '•••• 0000';
  if (accNumber.length <= 4) return accNumber;
  return `•••• ${accNumber.slice(-4)}`;
}
