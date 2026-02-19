import { SECURITY_CONSTANTS } from '@/core/domain/constants/security.constants';
import { HashProvider } from '@/core/domain/providers/hash.provider';
import { compare, hash } from 'bcryptjs';

/**
 * Concrete implementation of HashProvider using the bcryptjs library.
 * This class applies the security standards defined in the domain constants.
 */
export class BcryptHashProvider implements HashProvider {
  /** The cost factor for hashing algorithms. */
  private readonly saltRounds = SECURITY_CONSTANTS.HASH_SALT_ROUNDS;

  /**
   * Generates a unique hash from a plain text string using bcrypt.
   * @param payload The plain text string to be encrypted.
   * @return A promise that resolves to the generated hash string.
   */
  async hash(payload: string): Promise<string> {
    return hash(payload, this.saltRounds);
  }

  /**
   * Compares a plain text string against a stored hash to verify integrity.
   * @param payload The plain text string to verify.
   * @param hashed The stored hash string to compare against.
   * @return A promise that resolves to true if they match, false otherwise.
   */
  async compare(payload: string, hashed: string): Promise<boolean> {
    return compare(payload, hashed);
  }
}
