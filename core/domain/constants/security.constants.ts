/**
 * Security constants for the application.
 */
export const SECURITY_CONSTANTS = {
  HASH_SALT_ROUNDS: 12,
  DEFAULT_ACCESS_TOKEN_EXPIRATION: '15m',
  DEFAULT_REFRESH_TOKEN_EXPIRATION: '7d',
  REFRESH_TOKEN_GRACE_PERIOD_MS: 60 * 1000, // 60 seconds leeway for race conditions
} as const;
