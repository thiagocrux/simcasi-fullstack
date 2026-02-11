/**
 * Interface for Hashing operations (Domain Provider).
 * Decouples the application from specific libraries like bcrypt or argon2.
 * This contract defines the behavior required for sensitive data protection.
 */
export interface HashProvider {
  /**
   * Generates a unique hash from a plain text string.
   * @param payload The plain text string to be encrypted/hashed.
   * @return A promise that resolves to the generated hash string.
   */
  hash(payload: string): Promise<string>;

  /**
   * Compares a plain text string against an existing hash.
   * @param payload The plain text string to verify.
   * @param hashed The stored hash string to compare against.
   * @return A promise that resolves to true if they match, false otherwise.
   */
  compare(payload: string, hashed: string): Promise<boolean>;
}
