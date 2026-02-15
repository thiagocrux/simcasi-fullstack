import { BcryptHashProvider } from '../providers/bcrypt-hash.provider';
import { JoseTokenProvider } from '../providers/jose-token.provider';

/**
 * Singletons for security providers to preserve state and reduce overhead.
 */
const tokenProvider = new JoseTokenProvider();
const hashProvider = new BcryptHashProvider();

/**
 * Factory for TokenProvider (JWT handling).
 * @return A singleton instance of JoseTokenProvider.
 */
export function makeTokenProvider() {
  return tokenProvider;
}

/**
 * Factory for HashProvider (Password hashing).
 * @return A singleton instance of BcryptHashProvider.
 */
export function makeHashProvider() {
  return hashProvider;
}
