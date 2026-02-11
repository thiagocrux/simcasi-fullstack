/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Interface for Token management (Domain Provider).
 * Decouples the application from specific libraries like jsonwebtoken or jose.
 * Responsible for handling security tokens for authentication and session persistence.
 */
export interface TokenProvider {
  /**
   * Generates a stateless access token for authentication.
   * @param payload The data object to be encoded within the token.
   * @return A promise that resolves to the signed access token string.
   */
  generateAccessToken(payload: any): Promise<string>;

  /**
   * Generates a refresh token to allow session renewal.
   * @param payload The data object to be encoded within the refresh token.
   * @return A promise that resolves to the signed refresh token string.
   */
  generateRefreshToken(payload: any): Promise<string>;

  /**
   * Verifies the signature and decodes the token payload.
   * Note: The implementation should allow decoding even if cryptographically expired
   * to support custom logic/refresh flows where needed.
   *
   * @param token The JWT or token string to verify.
   * @return A promise that resolves to the decoded payload of type T, or null if invalid.
   */
  verifyToken<T>(token: string): Promise<T | null>;

  /**
   * Calculates the absolute expiry date for the refresh token.
   * Used primarily for database persistence of session expiration.
   *
   * @return The Date object representing when the refresh token expires.
   */
  getRefreshExpiryDate(): Date;

  /**
   * Returns the refresh token expiration duration in seconds.
   * Ideal for configuring HTTP-only cookie properties like 'maxAge'.
   *
   * @return The duration in seconds.
   */
  getRefreshExpirationInSeconds(): number;

  /**
   * Returns the access token expiration duration in seconds.
   * Useful for frontend applications to manage local session timeouts and refresh cycles.
   *
   * @return The duration in seconds.
   */
  getAccessExpirationInSeconds(): number;
}
