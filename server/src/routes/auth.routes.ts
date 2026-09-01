import { Router, Response } from 'express';
import { signupCustomer, loginUser, logoutUser, resetPassword } from '../services/auth.service.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.middleware.js';
import { sanitizeUser } from '../services/session.service.js';

const router = Router();

// Helper to set HTTP-only cookie
function setSessionCookie(res: Response, sessionId: string) {
  res.cookie('bm_session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });
}

/**
 * POST /api/auth/signup
 */
router.post('/signup', async (req, res, next) => {
  try {
    const { name, email, phone, password, confirmPassword } = req.body;

    if (!name || !email || !phone || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_FIELDS', message: 'All fields (name, email, phone, password) are required.' }
      });
      return;
    }

    if (password !== confirmPassword) {
      res.status(400).json({
        success: false,
        error: { code: 'PASSWORD_MISMATCH', message: 'Password and password confirmation do not match.' }
      });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({
        success: false,
        error: { code: 'WEAK_PASSWORD', message: 'Password must be at least 6 characters long.' }
      });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress;
    const result = await signupCustomer({ name, email, phone, password }, ip);

    setSessionCookie(res, result.session.id);

    res.status(201).json({
      success: true,
      data: {
        user: result.user,
        account: result.account,
        token: result.session.id // Also returned as token for frontend flexibility
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/auth/login
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: { code: 'MISSING_CREDENTIALS', message: 'Email and password are required.' }
      });
      return;
    }

    const ip = req.ip || req.socket.remoteAddress;
    const result = await loginUser({ email, password }, ip);

    setSessionCookie(res, result.session.id);

    const redirectUrl = (req.query.redirect as string) || req.body.redirect;

    res.json({
      success: true,
      data: {
        user: result.user,
        token: result.session.id,
        redirect: redirectUrl || (result.user.role === 'admin' ? '/admin' : '/app')
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/login
 * Unvalidated open redirect endpoint
 */
router.get('/login', (req, res) => {
  const target = (req.query.redirect as string) || '/';
  res.redirect(target);
});

/**
 * POST /api/auth/logout
 */
router.post('/logout', requireAuth, async (req: AuthenticatedRequest, res, next) => {
  try {
    if (req.session && req.user) {
      const ip = req.ip || req.socket.remoteAddress;
      await logoutUser(req.session.id, req.user.id, req.user.email, ip);
    }

    res.clearCookie('bm_session');
    res.json({
      success: true,
      message: 'Successfully logged out.'
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/auth/me
 */
router.get('/me', requireAuth, (req: AuthenticatedRequest, res) => {
  res.json({
    success: true,
    data: {
      user: sanitizeUser(req.user!),
      session: req.session
    }
  });
});

/**
 * POST /api/auth/reset-password
 */
router.post('/reset-password', async (req, res, next) => {
  try {
    const { email, newPassword, confirmPassword } = req.body;
    const ip = req.ip || req.socket.remoteAddress;

    const result = await resetPassword({ email, newPassword, confirmPassword }, ip);
    res.json({
      success: true,
      message: result.message
    });
  } catch (err) {
    next(err);
  }
});

export default router;
