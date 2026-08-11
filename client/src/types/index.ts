export type UserRole = 'customer' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  phone: string;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export type AccountType = 'Savings' | 'Checking' | 'Salary';
export type AccountStatus = 'active' | 'frozen' | 'closed';

export interface Account {
  id: string;
  userId: string;
  accountNumber: string;
  accountType: AccountType;
  currency: 'INR';
  balance: number; // In integer paise
  status: AccountStatus;
  createdAt: string;
}

export type TransactionType = 'transfer' | 'deposit' | 'withdrawal';
export type TransactionStatus = 'completed' | 'failed' | 'pending';

export interface Transaction {
  id: string;
  senderAccountId: string;
  receiverAccountId: string;
  senderName: string;
  receiverName: string;
  amount: number; // In integer paise
  currency: 'INR';
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: string;
  timestamp: string;
  metadata?: Record<string, any>;
  ip?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}
