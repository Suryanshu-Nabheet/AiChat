import type { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import { isBlocked } from '../utils/rateLimiter.js';

/**
 * Security headers middleware
 */
export const securityHeaders = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.openai.com', 'https://api.anthropic.com', 'https://openrouter.ai', 'https://generativelanguage.googleapis.com'],
    },
  },
  crossOriginEmbedderPolicy: false,
});

/**
 * Brute force protection middleware
 */
export function bruteForceProtection(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const ip = req.ip || req.socket.remoteAddress || 'unknown';

  if (isBlocked(ip)) {
    res.status(429).json({
      error: 'Too many failed attempts',
      message: 'Your IP has been temporarily blocked. Please try again later.',
    });
    return;
  }

  next();
}

/**
 * Request validation middleware
 */
export function validateRequest(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  // Check content length
  const contentLength = req.get('content-length');
  if (contentLength && parseInt(contentLength) > 10 * 1024 * 1024) {
    res.status(413).json({ error: 'Request too large' });
    return;
  }

  next();
}

/**
 * Get client IP address
 */
export function getClientIp(req: Request): string {
  return (
    (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
    req.headers['x-real-ip'] as string ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

