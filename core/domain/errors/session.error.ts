import { AppError } from './app.error';

/**
 * Thrown when a token is found to be cryptographically invalid or tampered with.
 * This is useful for the client to identify when it must attempt a refresh.
 */
export class InvalidTokenError extends AppError {
  constructor(message = 'The token provided is invalid or has expired.') {
    super(message, 401, 'INVALID_TOKEN');
  }
}

/**
 * Thrown when a security breach is detected (e.g., token reuse).
 * This indicates the client should clear all local data and logout immediately.
 */
export class SecurityBreachError extends AppError {
  constructor(
    message = 'A security breach was detected. All sessions have been revoked.'
  ) {
    super(message, 401, 'SECURITY_BREACH');
  }
}

/**
 * Thrown when a session is explicitly expired and cannot be refreshed.
 */
export class SessionExpiredError extends AppError {
  constructor(message = 'Your session has expired. Please log in again.') {
    super(message, 401, 'SESSION_EXPIRED');
  }
}
