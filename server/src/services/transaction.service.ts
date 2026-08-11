import { persistenceService } from './persistence.service.js';
import { createAuditLog } from './audit.service.js';
import { generateTransactionId } from '../utils/idGenerator.js';
import { Transaction } from '../types/index.js';

export interface CreateTransferInput {
  senderUserId: string;
  recipientAccountNumber: string;
  amountPaise: number; // Integer paise
  description?: string;
}

export function getCustomerTransactions(userId: string, filterType?: string, search?: string): Transaction[] {
  const state = persistenceService.getState();
  const senderAccount = state.accounts.find(a => a.userId === userId);
  if (!senderAccount) return [];

  let userTxns = state.transactions.filter(
    t => t.senderAccountId === senderAccount.id || t.receiverAccountId === senderAccount.id
  );

  if (filterType && filterType !== 'all') {
    if (filterType === 'incoming') {
      userTxns = userTxns.filter(t => t.receiverAccountId === senderAccount.id);
    } else if (filterType === 'outgoing') {
      userTxns = userTxns.filter(t => t.senderAccountId === senderAccount.id);
    }
  }

  if (search && search.trim()) {
    const q = search.trim().toLowerCase();
    userTxns = userTxns.filter(
      t =>
        t.id.toLowerCase().includes(q) ||
        t.description.toLowerCase().includes(q) ||
        t.senderName.toLowerCase().includes(q) ||
        t.receiverName.toLowerCase().includes(q)
    );
  }

  return userTxns.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function getTransactionById(transactionId: string, userId: string, isAdmin: boolean = false): Transaction {
  const state = persistenceService.getState();
  const txn = state.transactions.find(t => t.id === transactionId);
  if (!txn) {
    throw { status: 404, code: 'TRANSACTION_NOT_FOUND', message: 'Transaction record not found.' };
  }

  if (!isAdmin) {
    const userAccount = state.accounts.find(a => a.userId === userId);
    if (!userAccount || (txn.senderAccountId !== userAccount.id && txn.receiverAccountId !== userAccount.id)) {
      throw { status: 403, code: 'FORBIDDEN', message: 'You do not have permission to view this transaction.' };
    }
  }

  return txn;
}

export async function processTransfer(input: CreateTransferInput, ip?: string): Promise<{ transaction: Transaction; newBalance: number }> {
  const state = persistenceService.getState();

  // 1. Validate sender user & account
  const senderUser = state.users.find(u => u.id === input.senderUserId);
  if (!senderUser || senderUser.status === 'suspended') {
    throw { status: 403, code: 'ACCOUNT_SUSPENDED', message: 'Sender account is suspended or invalid.' };
  }

  const senderAccount = state.accounts.find(a => a.userId === input.senderUserId);
  if (!senderAccount || senderAccount.status !== 'active') {
    throw { status: 400, code: 'INVALID_SENDER_ACCOUNT', message: 'Sender bank account is not active.' };
  }

  // 2. Validate amount
  if (!Number.isInteger(input.amountPaise) || input.amountPaise <= 0) {
    throw { status: 400, code: 'INVALID_AMOUNT', message: 'Transfer amount must be a positive integer value.' };
  }

  // 3. Validate recipient account
  const cleanRecipientAcc = input.recipientAccountNumber.trim().toUpperCase();
  const receiverAccount = state.accounts.find(a => a.accountNumber === cleanRecipientAcc);
  if (!receiverAccount || receiverAccount.status !== 'active') {
    throw { status: 404, code: 'RECIPIENT_NOT_FOUND', message: 'Recipient account number was not found or is inactive.' };
  }

  // 4. Prevent self-transfer
  if (senderAccount.id === receiverAccount.id) {
    throw { status: 400, code: 'SELF_TRANSFER_NOT_ALLOWED', message: 'Transfers to your own account are not allowed.' };
  }

  // 5. Ensure sufficient balance
  if (senderAccount.balance < input.amountPaise) {
    throw { status: 400, code: 'INSUFFICIENT_BALANCE', message: 'Insufficient simulated balance for this transaction.' };
  }

  const receiverUser = state.users.find(u => u.id === receiverAccount.userId);
  const receiverName = receiverUser ? receiverUser.name : 'Account Holder';

  // 6. Perform atomic balance mutation
  senderAccount.balance -= input.amountPaise;
  receiverAccount.balance += input.amountPaise;

  const newTxn: Transaction = {
    id: generateTransactionId(),
    senderAccountId: senderAccount.id,
    receiverAccountId: receiverAccount.id,
    senderName: senderUser.name,
    receiverName,
    amount: input.amountPaise,
    currency: 'INR',
    type: 'transfer',
    status: 'completed',
    description: (input.description && input.description.trim()) || 'Simulated Money Transfer',
    createdAt: new Date().toISOString()
  };

  state.transactions.unshift(newTxn);
  await persistenceService.saveState(state);

  await createAuditLog(
    senderUser.id,
    senderUser.email,
    'TRANSFER',
    {
      transactionId: newTxn.id,
      recipientAccount: cleanRecipientAcc,
      amountPaise: input.amountPaise
    },
    ip
  );

  return {
    transaction: newTxn,
    newBalance: senderAccount.balance
  };
}
