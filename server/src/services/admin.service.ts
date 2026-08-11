import { persistenceService } from './persistence.service.js';
import { destroyAllUserSessions, sanitizeUser } from './session.service.js';
import { createAuditLog } from './audit.service.js';
import { UserStatus } from '../types/index.js';

export function getAdminDashboardStats() {
  const state = persistenceService.getState();

  const customers = state.users.filter(u => u.role === 'customer');
  const activeCustomers = customers.filter(u => u.status === 'active');
  const suspendedCustomers = customers.filter(u => u.status === 'suspended');

  const totalSimulatedBalance = state.accounts.reduce((acc, account) => acc + account.balance, 0);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const todayTransactions = state.transactions.filter(t => new Date(t.createdAt) >= startOfToday);
  const totalVolumePaise = state.transactions.reduce((acc, t) => acc + t.amount, 0);

  return {
    totalCustomers: customers.length,
    activeCustomers: activeCustomers.length,
    suspendedCustomers: suspendedCustomers.length,
    totalSimulatedBalance, // In integer paise
    totalTransactions: state.transactions.length,
    transactionsToday: todayTransactions.length,
    totalVolumePaise,
    systemStatus: 'online',
    lastSavedAt: state.metadata.lastSavedAt
  };
}

export function getAdminCustomers(search?: string, statusFilter?: string) {
  const state = persistenceService.getState();

  let customers = state.users.filter(u => u.role === 'customer');

  if (statusFilter && statusFilter !== 'all') {
    customers = customers.filter(u => u.status === statusFilter);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    customers = customers.filter(
      u =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.id.toLowerCase().includes(q)
    );
  }

  return customers.map(u => {
    const account = state.accounts.find(a => a.userId === u.id);
    return {
      ...sanitizeUser(u),
      accountNumber: account ? account.accountNumber : 'N/A',
      balance: account ? account.balance : 0,
      accountStatus: account ? account.status : 'inactive'
    };
  });
}

export function getAdminCustomerDetails(customerId: string) {
  const state = persistenceService.getState();
  const user = state.users.find(u => u.id === customerId);

  if (!user) {
    throw { status: 404, code: 'CUSTOMER_NOT_FOUND', message: 'Customer not found.' };
  }

  const account = state.accounts.find(a => a.userId === customerId);
  const userTransactions = account
    ? state.transactions.filter(t => t.senderAccountId === account.id || t.receiverAccountId === account.id)
    : [];

  return {
    customer: sanitizeUser(user),
    account,
    transactionCount: userTransactions.length,
    recentTransactions: userTransactions.slice(0, 10)
  };
}

export async function setCustomerStatus(adminUserId: string, adminEmail: string, customerId: string, status: UserStatus, ip?: string) {
  const state = persistenceService.getState();
  const user = state.users.find(u => u.id === customerId);

  if (!user) {
    throw { status: 404, code: 'CUSTOMER_NOT_FOUND', message: 'Customer not found.' };
  }

  if (user.role === 'admin') {
    throw { status: 400, code: 'CANNOT_SUSPEND_ADMIN', message: 'Admin accounts cannot be suspended.' };
  }

  user.status = status;
  user.updatedAt = new Date().toISOString();

  // Also update associated account status if necessary
  const account = state.accounts.find(a => a.userId === customerId);
  if (account) {
    account.status = status === 'suspended' ? 'frozen' : 'active';
  }

  // If suspending, destroy all active sessions immediately
  if (status === 'suspended') {
    await destroyAllUserSessions(customerId);
  }

  await persistenceService.saveState(state);

  await createAuditLog(
    adminUserId,
    adminEmail,
    'ADMIN_STATUS_CHANGE',
    { targetCustomerId: customerId, targetEmail: user.email, newStatus: status },
    ip
  );

  return {
    user: sanitizeUser(user),
    account
  };
}

export function getAdminAccounts() {
  const state = persistenceService.getState();
  return state.accounts.map(account => {
    const owner = state.users.find(u => u.id === account.userId);
    return {
      ...account,
      ownerName: owner ? owner.name : 'Unknown',
      ownerEmail: owner ? owner.email : 'Unknown'
    };
  });
}

export function getAdminTransactions(search?: string, statusFilter?: string) {
  const state = persistenceService.getState();
  let txns = [...state.transactions];

  if (statusFilter && statusFilter !== 'all') {
    txns = txns.filter(t => t.status === statusFilter);
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    txns = txns.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        t.receiverName.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q)
    );
  }

  return txns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
