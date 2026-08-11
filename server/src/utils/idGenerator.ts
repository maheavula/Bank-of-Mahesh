import crypto from 'crypto';

export function generateUserId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `USR-${num}`;
}

export function generateAccountId(): string {
  const num = Math.floor(10000 + Math.random() * 90000);
  return `ACC-${num}`;
}

export function generateTransactionId(): string {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `TXN-${hex}`;
}

export function generateSessionId(): string {
  return `SESS-${crypto.randomBytes(24).toString('hex')}`;
}

export function generateAuditId(): string {
  const hex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `AUDIT-${hex}`;
}
