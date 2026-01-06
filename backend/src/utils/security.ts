import * as crypto from 'crypto';
import bcrypt from 'bcryptjs';

/**
 * Generate a cryptographically secure random ID
 */
export function generateSecureId(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a secure session token
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(64).toString('hex');
}

/**
 * Hash a password securely
 */
export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Sanitize user input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+=/gi, '');
}

/**
 * Validate API key format (basic validation)
 */
export function validateApiKey(apiKey: string): boolean {
  if (!apiKey || apiKey.length < 20) return false;
  // Basic format check - adjust based on provider requirements
  return /^[a-zA-Z0-9_-]+$/.test(apiKey);
}

/**
 * Rate limiting key generator
 */
export function getRateLimitKey(ip: string, endpoint: string): string {
  return `rate_limit:${endpoint}:${ip}`;
}

