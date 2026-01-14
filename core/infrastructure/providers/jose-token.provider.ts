/* eslint-disable @typescript-eslint/no-explicit-any */
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
    const secretKey = process.env.JWT_SECRET || 'default_secret_key_change_me';
    this.secret = new TextEncoder().encode(secretKey);
    this.accessExpiration = process.env.JWT_ACCESS_EXPIRATION || '15m';
    this.refreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
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
   * @param token - The token to verify.
   * @returns The decoded payload or null if invalid.
   */
  async verifyToken<T>(token: string): Promise<T | null> {
    try {
      const { payload } = await jwtVerify(token, this.secret);
      return payload as T;
    } catch {
      return null;
    }
  }

  /**
   * Returns the expiry date for a refresh token.
   * Based on the configuration in JWT_REFRESH_EXPIRATION (default 7d).
   */
  getRefreshExpiryDate(): Date {
    const expiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
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
      date.setDate(date.getDate() + 7);
    }

    return date;
  }
}
