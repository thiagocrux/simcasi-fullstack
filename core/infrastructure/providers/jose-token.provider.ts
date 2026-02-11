/* eslint-disable @typescript-eslint/no-explicit-any */
import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { TokenProvider } from '@/core/domain/providers/token.provider';
import { SignJWT, jwtVerify } from 'jose';

/**
 * Concrete implementation of TokenProvider using the 'jose' library.
 * It provides a modern, edge-compatible approach to JWT handling using the Web Crypto API.
 */
export class JoseTokenProvider implements TokenProvider {
  /** Encoded secret key for token signing and verification. */
  private readonly secret: Uint8Array;
  /** Duration for access token validity. */
  private readonly accessExpiration: string;
  /** Duration for refresh token validity. */
  private readonly refreshExpiration: string;

  /**
   * Initializes the provider by encoding the JWT_SECRET from environment variables.
   * @throws Error If JWT_SECRET is not defined.
   */
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
   * Generates a signed access token (JWT) using the HS256 algorithm.
   * @param payload The data object to be included in the JWT claims.
   * @return A promise that resolves to the signed JWT string.
   */
  async generateAccessToken(payload: Record<string, any>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.accessExpiration)
      .sign(this.secret);
  }

  /**
   * Generates a signed refresh token (JWT) using the HS256 algorithm.
   * @param payload The data object to be included in the refresh token claims.
   * @return A promise that resolves to the signed refresh token string.
   */
  async generateRefreshToken(payload: Record<string, any>): Promise<string> {
    return new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime(this.refreshExpiration)
      .sign(this.secret);
  }

  /**
   * Verifies the token signature and decodes its payload.
   * Note: This implementation is configured to ignore the expiration date
   * during verification to allow the application to handle refresh logic
   * specifically for expired tokens.
   *
   * @param token The JWT string to verify.
   * @return A promise that resolves to the payload of type T, or null if the signature is invalid.
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
   * Calculates the precise expiration Date for a refresh token.
   * Supports 'd' (days), 'h' (hours), and 'm' (minutes) suffixes.
   *
   * @return The Date object representing the absolute expiration time.
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
   * Converts the refresh token expiration setting into a total number of seconds.
   * Supports 'd' (days), 'h' (hours), 'm' (minutes), and 's' (seconds) suffixes.
   *
   * @return The expiration duration in seconds.
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
   * Converts the access token expiration setting into a total number of seconds.
   * Supports 'd' (days), 'h' (hours), 'm' (minutes), and 's' (seconds) suffixes.
   *
   * @return The expiration duration in seconds.
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
