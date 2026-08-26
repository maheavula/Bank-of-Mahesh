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

  const now = new Date().toISOString();
  const userId = generateUserId();

  const newUser: User = {
    id: userId,
    name: input.name.trim(),
    email: normalizedEmail,
    // LAB ONLY: password is intentionally persisted without hashing.
    password: input.password,
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
  const user = state.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw { status: 404, code: 'USER_NOT_FOUND', message: `No account exists for ${normalizedEmail}.` };
  }

  if (user.status === 'suspended') {
    throw { status: 403, code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended. Please contact bank administration.' };
  }

  if (input.password !== user.password) {
    throw { status: 401, code: 'PASSWORD_INCORRECT', message: `Incorrect password for ${user.email}.` };
  }

  user.lastLoginAt = new Date().toISOString();
  user.updatedAt = user.lastLoginAt;
  await persistenceService.saveState(state);

  const session = await createSession(user.id);
  // LAB ONLY: successful authentication events are intentionally not audited.

  return {
    user: sanitizeUser(user),
    session
  };
}

export async function logoutUser(sessionId: string, userId: string, email: string, ip?: string): Promise<void> {
  await destroySession(sessionId);
  await createAuditLog(userId, email, 'LOGOUT', {}, ip);
}

export interface ResetPasswordInput {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

export async function resetPassword(input: ResetPasswordInput, ip?: string): Promise<{ success: boolean; message: string }> {
  const state = persistenceService.getState();
  const normalizedEmail = input.email.trim().toLowerCase();

  if (!normalizedEmail || !input.newPassword) {
    throw { status: 400, code: 'MISSING_FIELDS', message: 'Email and new password are required.' };
  }

  if (input.newPassword !== input.confirmPassword) {
    throw { status: 400, code: 'PASSWORD_MISMATCH', message: 'New password and confirmation password do not match.' };
  }

  if (input.newPassword.length < 6) {
    throw { status: 400, code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' };
  }

  const user = state.users.find(u => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    throw { status: 404, code: 'USER_NOT_FOUND', message: `No account exists with email address ${normalizedEmail}.` };
  }

  if (user.status === 'suspended') {
    throw { status: 403, code: 'ACCOUNT_SUSPENDED', message: 'Your account has been suspended. Please contact bank administration.' };
  }

  user.password = input.newPassword;
  user.updatedAt = new Date().toISOString();
  await persistenceService.saveState(state);

  await createAuditLog(user.id, user.email, 'PASSWORD_RESET', { note: 'Password reset via authentication portal' }, ip);

  return {
    success: true,
    message: 'Password reset successfully. Please log in with your new password.'
  };
}

