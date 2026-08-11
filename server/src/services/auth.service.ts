import bcrypt from 'bcryptjs';
import { persistenceService } from './persistence.service.js';
import { createSession, destroySession, sanitizeUser } from './session.service.js';
import { createAuditLog } from './audit.service.js';
import { generateUserId, generateAccountId } from '../utils/idGenerator.js';
import { generateAccountNumber } from '../utils/accountNumber.js';
import { User, Account, Session, PublicUser } from '../types/index.js';

export interface SignupInput {
  name: string;
  email: string;
  phone: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export async function signupCustomer(input: SignupInput, ip?: string): Promise<{ user: PublicUser; account: Account; session: Session }> {
  const state = persistenceService.getState();
  const normalizedEmail = input.email.trim().toLowerCase();

  // Check duplicate email
  const existingUser = state.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (existingUser) {
    throw { status: 400, code: 'EMAIL_EXISTS', message: 'An account with this email address already exists.' };
  }

  const passwordHash = await bcrypt.hash(input.password, 10);
  const now = new Date().toISOString();
  const userId = generateUserId();

  const newUser: User = {
    id: userId,
    name: input.name.trim(),
    email: normalizedEmail,
    passwordHash,
    role: 'customer',
    status: 'active',
    phone: input.phone.trim(),
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now
  };

  // Create simulated savings account with starting welcome bonus of ₹10,000 (1000000 paise)
  const newAccount: Account = {
    id: generateAccountId(),
    userId: userId,
    accountNumber: generateAccountNumber(),
    accountType: 'Savings',
    currency: 'INR',
    balance: 1000000, // ₹10,000.00
    status: 'active',
    createdAt: now
  };

  state.users.push(newUser);
  state.accounts.push(newAccount);
  await persistenceService.saveState(state);

  const session = await createSession(newUser.id);
  await createAuditLog(newUser.id, newUser.email, 'SIGNUP', { accountId: newAccount.id }, ip);

  return {
    user: sanitizeUser(newUser),
    account: newAccount,
    session
  };
}

export async function loginUser(input: LoginInput, ip?: string): Promise<{ user: PublicUser; session: Session }> {
  const state = persistenceService.getState();
  const normalizedEmail = input.email.trim().toLowerCase();

  // Generic message for invalid credentials to prevent email enumeration
  const invalidCredsError = { status: 401, code: 'INVALID_CREDENTIALS', message: 'Invalid email or password.' };

  const user = state.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw invalidCredsError;
  }

  if (user.status === 'suspended') {
    throw { status: 403, code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended. Please contact bank administration.' };
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    throw invalidCredsError;
  }

  user.lastLoginAt = new Date().toISOString();
  user.updatedAt = user.lastLoginAt;
  await persistenceService.saveState(state);

  const session = await createSession(user.id);
  await createAuditLog(user.id, user.email, 'LOGIN', {}, ip);

  return {
    user: sanitizeUser(user),
    session
  };
}

export async function logoutUser(sessionId: string, userId: string, email: string, ip?: string): Promise<void> {
  await destroySession(sessionId);
  await createAuditLog(userId, email, 'LOGOUT', {}, ip);
}
