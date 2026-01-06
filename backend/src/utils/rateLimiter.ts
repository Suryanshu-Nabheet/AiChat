import rateLimit from 'express-rate-limit';
import type { Request, Response } from 'express';

// Store for tracking brute force attempts
const bruteForceAttempts = new Map<string, { count: number; resetTime: number }>();

const BRUTE_FORCE_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_BRUTE_FORCE_ATTEMPTS = 5;

/**
 * Check if IP is blocked due to brute force attempts
 */
export function isBlocked(ip: string): boolean {
  const record = bruteForceAttempts.get(ip);
  if (!record) return false;

  if (Date.now() > record.resetTime) {
    bruteForceAttempts.delete(ip);
    return false;
  }

  return record.count >= MAX_BRUTE_FORCE_ATTEMPTS;
}

/**
 * Record a failed attempt
 */
export function recordFailedAttempt(ip: string): void {
  const record = bruteForceAttempts.get(ip);
  const now = Date.now();

  if (!record || now > record.resetTime) {
    bruteForceAttempts.set(ip, { count: 1, resetTime: now + BRUTE_FORCE_WINDOW });
  } else {
    record.count += 1;
  }
}

/**
 * Clear failed attempts (on successful login)
 */
export function clearFailedAttempts(ip: string): void {
  bruteForceAttempts.delete(ip);
}

/**
 * General API rate limiter
 */
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: 'Too many requests',
      message: 'Please try again later.',
    });
  },
});

/**
 * Strict rate limiter for authentication endpoints
 */
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: 'Too many authentication attempts, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
});

/**
 * Rate limiter for chat endpoints
 */
export const chatLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: 'Too many chat requests, please slow down.',
  standardHeaders: true,
  legacyHeaders: false,
});

