import { HashProvider } from '@/core/domain/providers/hash.provider';
import { compare, hash } from 'bcryptjs';

/**
 * Concrete implementation of HashProvider using bcryptjs.
 */
export class BcryptHashProvider implements HashProvider {
  private readonly saltRounds = 12;

  /**
   * Hashes a plain text string.
   * @param payload - The string to hash.
   * @returns The hashed string.
   */
  async hash(payload: string): Promise<string> {
    return hash(payload, this.saltRounds);
  }

  /**
   * Compares a plain text string with a hash.
   * @param payload - The plain text string.
   * @param hashed - The hash to compare against.
   * @returns True if they match, false otherwise.
   */
  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
