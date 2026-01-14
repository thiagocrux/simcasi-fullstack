/**
 * Interface for Hashing operations (Domain Provider).
 * Decouples the application from specific libraries like bcrypt or argon2.
 */
export interface HashProvider {
  /**
   * Generates a hash from a plain text string.
   */
  hash(payload: string): Promise<string>;

  /**
   * Compares a plain text string with a hash.
   */
  compare(payload: string, hashed: string): Promise<boolean>;
}
