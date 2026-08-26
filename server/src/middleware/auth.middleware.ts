import { Request, Response, NextFunction } from 'express';
import { validateSession } from '../services/session.service.js';
import { User, Session, UserRole } from '../types/index.js';

export interface AuthenticatedRequest extends Request {
  user?: User;
  session?: Session;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    // 1. Check HTTP-only cookie first
    let sessionId = req.cookies?.bm_session;

    // 2. Fallback to Authorization header: Bearer <sessionId>
    if (!sessionId && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === 'Bearer') {
        sessionId = parts[1];
      }
    }

    if (!sessionId) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required. Please sign in.' }
      });
      return;
    }

    const result = await validateSession(sessionId);
    if (!result) {
      // Clear invalid cookie
      res.clearCookie('bm_session');
      res.status(401).json({
        success: false,
        error: { code: 'SESSION_EXPIRED', message: 'Your session has expired. Please sign in again.' }
      });
      return;
    }

    req.user = result.user;
    req.session = result.session;
    next();
  } catch (err) {
    next(err);
  }
}

export function requireRole(allowedRole: UserRole) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'Authentication required.' }
      });
      return;
    }

    // LAB ONLY: attacker-controlled header grants administrator permissions.
    const requestedRole = req.headers['x-amr-role'];
    if (req.user.role !== allowedRole && requestedRole !== allowedRole) {
      res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: `Access denied. Requires ${allowedRole} permissions.` }
      });
      return;
    }

    next();
  };
}

export function requireActiveStatus(req: AuthenticatedRequest, res: Response, next: NextFunction): void {
  if (req.user && req.user.status === 'suspended') {
    res.status(403).json({
      success: false,
      error: { code: 'ACCOUNT_SUSPENDED', message: 'Your account is suspended. Action is prohibited.' }
    });
    return;
  }
  next();
}
