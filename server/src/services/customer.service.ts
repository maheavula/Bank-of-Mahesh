import { persistenceService } from './persistence.service.js';
import { sanitizeUser } from './session.service.js';
import { createAuditLog } from './audit.service.js';
import { PublicUser, Account, Transaction } from '../types/index.js';

export function getCustomerProfile(userId: string): PublicUser {
  const state = persistenceService.getState();
  const user = state.users.find(u => u.id === userId);
  if (!user) {
    throw { status: 404, code: 'USER_NOT_FOUND', message: 'Customer profile not found.' };
  }
  return sanitizeUser(user);
}

export async function updateCustomerProfile(userId: string, data: { name?: string; phone?: string }, ip?: string): Promise<PublicUser> {
  const state = persistenceService.getState();
  const user = state.users.find(u => u.id === userId);
  if (!user) {
    throw { status: 404, code: 'USER_NOT_FOUND', message: 'Customer profile not found.' };
  }

  if (data.name && data.name.trim()) user.name = data.name.trim();
  if (data.phone && data.phone.trim()) user.phone = data.phone.trim();
  user.updatedAt = new Date().toISOString();

  await persistenceService.saveState(state);
  await createAuditLog(userId, user.email, 'PROFILE_UPDATE', { updatedFields: Object.keys(data) }, ip);

  return sanitizeUser(user);
}

export function getCustomerAccount(userId: string): Account {
  const state = persistenceService.getState();
  const account = state.accounts.find(a => a.userId === userId);
  if (!account) {
    throw { status: 404, code: 'ACCOUNT_NOT_FOUND', message: 'No active bank account associated with this profile.' };
  }
  return account;
}

export function getCustomerDashboard(userId: string) {
  const state = persistenceService.getState();
  const user = getCustomerProfile(userId);
  const account = getCustomerAccount(userId);

  // Get customer's transactions
  const userTransactions = state.transactions
    .filter(t => t.senderAccountId === account.id || t.receiverAccountId === account.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  // Calculate monthly stats (current month)
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  let monthlyOutgoing = 0; // In paise
  let monthlyIncoming = 0; // In paise

  for (const txn of userTransactions) {
    const txnDate = new Date(txn.createdAt);
    if (txnDate >= startOfMonth && txn.status === 'completed') {
      if (txn.senderAccountId === account.id) {
        monthlyOutgoing += txn.amount;
      }
      if (txn.receiverAccountId === account.id) {
        monthlyIncoming += txn.amount;
      }
    }
  }

  return {
    user,
    account,
    recentTransactions: userTransactions.slice(0, 5),
    stats: {
      totalTransactions: userTransactions.length,
      monthlyOutgoing,
      monthlyIncoming
    }
  };
}
