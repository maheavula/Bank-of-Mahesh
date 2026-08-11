import { persistenceService } from './persistence.service.js';
import { generateAuditId } from '../utils/idGenerator.js';
import { AuditLog } from '../types/index.js';

export async function createAuditLog(
  userId: string,
  userEmail: string,
  action: AuditLog['action'],
  metadata?: Record<string, any>,
  ip?: string
): Promise<AuditLog> {
  const state = persistenceService.getState();
  
  // Sanitize metadata to never include passwords
  const sanitizedMetadata = metadata ? { ...metadata } : {};
  if (sanitizedMetadata.password) delete sanitizedMetadata.password;
  if (sanitizedMetadata.confirmPassword) delete sanitizedMetadata.confirmPassword;
  if (sanitizedMetadata.passwordHash) delete sanitizedMetadata.passwordHash;

  const logEntry: AuditLog = {
    id: generateAuditId(),
    userId,
    userEmail,
    action,
    timestamp: new Date().toISOString(),
    metadata: Object.keys(sanitizedMetadata).length > 0 ? sanitizedMetadata : undefined,
    ip
  };

  state.auditLogs.unshift(logEntry);
  await persistenceService.saveState(state);
  return logEntry;
}

export function getAuditLogs(): AuditLog[] {
  const state = persistenceService.getState();
  return state.auditLogs;
}
