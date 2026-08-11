export type UserRole = 'customer' | 'admin';
export type UserStatus = 'active' | 'suspended';

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
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
  balance: number; // Stored in integer paise (1 INR = 100 paise)
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
  amount: number; // Stored in integer paise
  currency: 'INR';
  type: TransactionType;
  status: TransactionStatus;
  description: string;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
  lastActivityAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  userEmail: string;
  action: 'LOGIN' | 'LOGOUT' | 'SIGNUP' | 'TRANSFER' | 'PROFILE_UPDATE' | 'ADMIN_STATUS_CHANGE' | 'SESSION_EXPIRED';
  timestamp: string;
  metadata?: Record<string, any>;
  ip?: string;
}

export interface RuntimeMetadata {
  application: string;
  version: string;
  mode: 'simulation';
  lastSavedAt: string;
}

export interface RuntimeData {
  users: User[];
  accounts: Account[];
  transactions: Transaction[];
  sessions: Session[];
  auditLogs: AuditLog[];
  metadata: RuntimeMetadata;
}

export interface PublicUser {
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
