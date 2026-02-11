/**
 * Security constants for the application.
 * Defines cryptographic parameters and token lifecycle policies.
 */
export const SECURITY_CONSTANTS = {
  /** Cost factor for the bcrypt hashing algorithm. */
  HASH_SALT_ROUNDS: 12,
  /** Duration for which an access token is valid (stateless). */
  DEFAULT_ACCESS_TOKEN_EXPIRATION: '15m',
  /** Duration for which a refresh token is valid (session persistence). */
  DEFAULT_REFRESH_TOKEN_EXPIRATION: '7d',
  /** Leeway time in milliseconds to prevent race conditions during token refresh. */
  REFRESH_TOKEN_GRACE_PERIOD_MS: 60 * 1000,
} as const;
