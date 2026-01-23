/**
 * Security constants for the application.
 */
export const SECURITY_CONSTANTS = {
  HASH_SALT_ROUNDS: 12,
  DEFAULT_ACCESS_TOKEN_EXPIRATION: '15m',
  DEFAULT_REFRESH_TOKEN_EXPIRATION: '7d',
} as const;
