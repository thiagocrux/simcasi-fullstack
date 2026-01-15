import { AppError } from './app.error';

/**
 * Thrown when a token is found to be cryptographically invalid or tampered with.
 * This is useful for the client to identify when it must attempt a refresh.
 */
export class InvalidTokenError extends AppError {
  constructor(message = 'O token fornecido é inválido ou expirou.') {
    super(message, 401, 'INVALID_TOKEN');
  }
}

/**
 * Thrown when a security breach is detected (e.g., token reuse).
 * This indicates the client should clear all local data and logout immediately.
 */
export class SecurityBreachError extends AppError {
  constructor(
    message = 'Uma quebra de segurança foi detectada. Todas as sessões foram revogadas.'
  ) {
    super(message, 401, 'SECURITY_BREACH');
  }
}

/**
 * Thrown when a session is explicitly expired and cannot be refreshed.
 */
export class SessionExpiredError extends AppError {
  constructor(
    message = 'Sua sessão expirou. Por favor, faça login novamente.'
  ) {
    super(message, 401, 'SESSION_EXPIRED');
  }
}
