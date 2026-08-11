import { Router } from 'express';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { sanitizeUser } from '../services/session.service.js';
import { persistenceService } from '../services/persistence.service.js';
import { CONFIG } from '../config.js';

const router = Router();

/**
 * GET /api/session
 * Validates current session and returns session expiration details
 */
router.get('/', requireAuth, (req: AuthenticatedRequest, res) => {
  const session = req.session!;
  const user = req.user!;

  const now = new Date();
  const expiresAt = new Date(session.expiresAt);
  const remainingSeconds = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 1000));

  res.json({
    success: true,
    data: {
      valid: true,
      sessionId: session.id,
      userId: user.id,
      role: user.role,
      status: user.status,
      expiresAt: session.expiresAt,
      remainingSeconds,
      user: sanitizeUser(user)
    }
  });
});

/**
 * POST /api/session/refresh
 * Refreshes current session expiration time
 */
router.post('/refresh', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    const session = req.session!;
    const state = persistenceService.getState();
    const currentSession = state.sessions.find(s => s.id === session.id);

    if (!currentSession) {
      res.status(401).json({
        success: false,
        error: { code: 'INVALID_SESSION', message: 'Session no longer active.' }
      });
      return;
    }

    const now = new Date();
    const newExpiresAt = new Date(now.getTime() + CONFIG.SESSION_IDLE_MINUTES * 60 * 1000);

    currentSession.expiresAt = newExpiresAt.toISOString();
    currentSession.lastActivityAt = now.toISOString();

    await persistenceService.saveState(state);

    res.json({
      success: true,
      message: 'Session refreshed successfully.',
      data: {
        sessionId: currentSession.id,
        expiresAt: currentSession.expiresAt
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
