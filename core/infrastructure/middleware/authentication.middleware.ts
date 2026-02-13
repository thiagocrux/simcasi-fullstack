import { NextRequest } from 'next/server';

import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { makeValidateSessionUseCase } from '../factories/session.factory';

/**
 * Represents the context of an authenticated request.
 */
export interface AuthenticationContext {
  /** The unique identifier of the authenticated user. */
  userId: string;
  /** The unique identifier of the role assigned to the user. */
  roleId: string;
  /** The programmatic code of the role (e.g., 'admin', 'user', 'viewer'). */
  roleCode: string;
  /** The unique identifier of the active session. */
  sessionId: string;
}

/**
 * Authenticates an incoming request by validating the JWT token.
 *
 * The token is searched in the following order:
 * 1. The `tokenOverride` parameter (if provided via retry logic).
 * 2. The 'Authorization' header (using the Bearer scheme).
 * 3. The 'access_token' cookie.
 *
 * @param request The incoming Next.js request object.
 * @param tokenOverride Optional token to bypass header/cookie lookup (useful for retries).
 * @return A promise that resolves with the user's authentication context.
 * @throws {InvalidTokenError} If the authentication token is missing or invalid.
 */
export async function authenticateRequest(
  request: NextRequest,
  tokenOverride?: string
): Promise<AuthenticationContext> {
  let token = tokenOverride;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    token = request.cookies.get('access_token')?.value;

    // Prioritize Authorization Header.
    if (authHeader) {
      if (authHeader.toLowerCase().startsWith('bearer ')) {
        token = authHeader.substring(7).trim();
      } else {
        // Fallback for tools/clients that might send the token directly without "Bearer".
        token = authHeader.trim();
      }
    }
  }

  if (!token) {
    throw new InvalidTokenError('Authentication token is missing.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  const result = await validateSessionUseCase.execute({ token });

  return result;
}
