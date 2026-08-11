import { Request, Response, NextFunction } from 'express';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

const loginAttempts = new Map<string, RateLimitRecord>();
const generalAttempts = new Map<string, RateLimitRecord>();

/**
 * OWASP A05 & A07: Rate Limiter for Login Endpoint (Brute-Force Protection)
 * Limits to 5 login attempts per IP per 1 minute window.
 */
export function rateLimitLogin(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxAttempts = 10; // Max 10 attempts per minute

  const record = loginAttempts.get(ip);

  if (!record || now > record.resetTime) {
    loginAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxAttempts) {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'Too many login attempts. Please try again after 1 minute.'
      }
    });
    return;
  }

  record.count += 1;
  next();
}

/**
 * OWASP Rate Limiter for General API Endpoints
 * Limits to 100 requests per IP per 1 minute window.
 */
export function rateLimitApi(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const now = Date.now();
  const windowMs = 60 * 1000;
  const maxRequests = 200;

  const record = generalAttempts.get(ip);

  if (!record || now > record.resetTime) {
    generalAttempts.set(ip, { count: 1, resetTime: now + windowMs });
    return next();
  }

  if (record.count >= maxRequests) {
    res.status(429).json({
      success: false,
      error: {
        code: 'TOO_MANY_REQUESTS',
        message: 'API rate limit exceeded. Please slow down.'
      }
    });
    return;
  }

  record.count += 1;
  next();
}
