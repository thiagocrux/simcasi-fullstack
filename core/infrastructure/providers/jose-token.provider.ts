/* eslint-disable @typescript-eslint/no-explicit-any */
import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { SignJWT, jwtVerify } from 'jose';

/**
 * Concrete implementation of TokenProvider using the 'jose' library.
 */
export class JoseTokenProvider implements TokenProvider {
  private readonly secret: Uint8Array;
  private readonly accessExpiration: string;
  private readonly refreshExpiration: string;

  constructor() {
    const secretKey = process.env.JWT_SECRET;

    if (!secretKey) {
      throw new Error(
        'JWT_SECRET is not defined in the environment variables. The system cannot start without a security secret.'
      );
    }

    this.secret = new TextEncoder().encode(secretKey);
    this.accessExpiration =
      process.env.JWT_ACCESS_TOKEN_EXPIRATION ||
      SECURITY_CONSTANTS.DEFAULT_ACCESS_TOKEN_EXPIRATION;
    this.refreshExpiration =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
      SECURITY_CONSTANTS.DEFAULT_REFRESH_TOKEN_EXPIRATION;
  }

  /**
   * Generates an access token.
   * @param payload - Data to include in the token.
   * @returns The signed JWT.
   */
  async generateAccessToken(payload: Record<string, any>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.accessExpiration)
      .sign(this.secret);
  }

  /**
   * Generates a refresh token.
   * @param payload - Data to include in the token.
   * @returns The signed JWT.
   */
  async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.refreshExpiration)
      .sign(this.secret);
  }

  /**
   * Verifies and decodes a token.
   * NOTE: For the security architecture of this project, we ALWAYS allow
   * decoding the payload even if the JWT is expired (cryptographically).
   * Validation of expiration should be handled by the business logic
   * or specific Use Cases if needed.
   *
   * @param token - The token to verify.
   * @returns The decoded payload or null if invalid.
   */
  async verifyToken<T>(token: string): Promise<T | null> {
    try {
      // We use a date in the past (Unix epoch) to ensure jwtVerify
      // always considers the token "not yet expired" during the decode phase.
      const { payload } = await jwtVerify(token, this.secret, {
        currentDate: new Date(0),
      });
      return payload as T;
    } catch (error: any) {
      // We only return null if the token is signature-invalid or malformed.
      return null;
    }
  }

  /**
   * Returns the expiry date for a refresh token.
   * Based on the configuration in JWT_REFRESH_TOKEN_EXPIRATION (default in security.constants).
   */
  getRefreshExpiryDate(): Date {
    const expiration =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
      SECURITY_CONSTANTS.DEFAULT_REFRESH_TOKEN_EXPIRATION;
    const amount = parseInt(expiration);
    const unit = expiration.slice(-1);

    const date = new Date();
    if (unit === 'd') {
      date.setDate(date.getDate() + amount);
    } else if (unit === 'h') {
      date.setHours(date.getHours() + amount);
    } else if (unit === 'm') {
      date.setMinutes(date.getMinutes() + amount);
    } else {
      // Final fallback if parsing fails
      date.setDate(date.getDate() + 7);
    }

    return date;
  }

  /**
   * Returns the refresh token expiration time in seconds.
   * Based on the configuration in JWT_REFRESH_TOKEN_EXPIRATION (default in security.constants).
   */
  getRefreshExpirationInSeconds(): number {
    const expiration =
      process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
      SECURITY_CONSTANTS.DEFAULT_REFRESH_TOKEN_EXPIRATION;
    const amount = parseInt(expiration);
    const unit = expiration.slice(-1);

    switch (unit) {
      case 'd':
        return amount * 24 * 60 * 60;
      case 'h':
        return amount * 60 * 60;
      case 'm':
        return amount * 60;
      case 's':
        return amount;
      default:
        // Default based on constants
        return 7 * 24 * 60 * 60;
    }
  }

  /**
   * Returns the access token expiration time in seconds.
   * Based on the configuration in JWT_ACCESS_TOKEN_EXPIRATION (default in security.constants).
   */
  getAccessExpirationInSeconds(): number {
    const expiration =
      process.env.JWT_ACCESS_TOKEN_EXPIRATION ||
      SECURITY_CONSTANTS.DEFAULT_ACCESS_TOKEN_EXPIRATION;
    const amount = parseInt(expiration);
    const unit = expiration.slice(-1);

    switch (unit) {
      case 'd':
        return amount * 24 * 60 * 60;
      case 'h':
        return amount * 60 * 60;
      case 'm':
        return amount * 60;
      case 's':
        return amount;
      default:
        // Default (15 minutes)
        return 15 * 60;
    }
  }
}
