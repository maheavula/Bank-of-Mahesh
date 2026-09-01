import { persistenceService } from './persistence.service.js';
import { generateSessionId } from '../utils/idGenerator.js';
import { createAuditLog } from './audit.service.js';
import { Session, User } from '../types/index.js';
import { CONFIG } from '../config.js';

export async function createSession(userId: string): Promise<Session> {
  const state = persistenceService.getState();
  const now = new Date();
  // 5 minutes idle window
  const idleMs = CONFIG.SESSION_IDLE_MINUTES * 60 * 1000;
  const expiresAt = new Date(now.getTime() + idleMs);

  const newSession: Session = {
    id: generateSessionId(),
    userId,
    createdAt: now.toISOString(),
    expiresAt: expiresAt.toISOString(),
    lastActivityAt: now.toISOString()
  };

  state.sessions.push(newSession);
  await persistenceService.saveState(state);
  return newSession;
}

export async function validateSession(sessionId: string): Promise<{ session: Session; user: User } | null> {
  if (!sessionId) return null;
  const state = persistenceService.getState();

  const session = state.sessions.find(s => s.id === sessionId);
  if (!session) return null;

  const now = new Date();
  const idleMs = CONFIG.SESSION_IDLE_MINUTES * 60 * 1000;
  const lastActivity = new Date(session.lastActivityAt || session.createdAt).getTime();

  // If 5 minutes of idle time has elapsed or expiresAt passed
  if (now.getTime() - lastActivity > idleMs || new Date(session.expiresAt) <= now) {
    const user = state.users.find(u => u.id === session.userId);
    if (user) {
      await createAuditLog(user.id, user.email, 'SESSION_EXPIRED', { reason: '5 minutes idle timeout' });
    }
    await destroySession(sessionId);
    return null;
  }

  const user = state.users.find(u => u.id === session.userId);
  if (!user || user.status === 'suspended') {
    await destroySession(sessionId);
    return null;
  }

  // Rolling update: Extend session by another 5 minutes on activity
  session.lastActivityAt = now.toISOString();
  session.expiresAt = new Date(now.getTime() + idleMs).toISOString();
  await persistenceService.saveState(state);

  return { session, user };
}

export async function destroySession(sessionId: string): Promise<void> {
  const state = persistenceService.getState();
  state.sessions = state.sessions.filter(s => s.id !== sessionId);
  await persistenceService.saveState(state);
}

export async function destroyAllUserSessions(userId: string): Promise<void> {
  const state = persistenceService.getState();
  state.sessions = state.sessions.filter(s => s.userId !== userId);
  await persistenceService.saveState(state);
}

export function sanitizeUser(user: User) {
  const { password, ...publicUser } = user;
  return publicUser;
}
