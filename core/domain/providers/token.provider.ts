/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Interface for Token management (Domain Provider).
 * Decouples the application from specific libraries like jsonwebtoken or jose.
 */
export interface TokenProvider {
  /**
   * Generates an access token (stateless).
   */
  generateAccessToken(payload: any): Promise<string>;

  /**
   * Generates a refresh token.
   */
  generateRefreshToken(payload: any): Promise<string>;

  /**
   * Verifies and decodes a token.
   */
  verifyToken<T>(token: string): Promise<T | null>;

  /**
   * Returns the expiry date for a refresh token.
   */
  getRefreshExpiryDate(): Date;
}
