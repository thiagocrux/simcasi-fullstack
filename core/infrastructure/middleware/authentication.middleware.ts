import { NextRequest } from 'next/server';

import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { makeValidateSessionUseCase } from '../factories/session.factory';

export interface AuthenticationContext {
  userId: string;
  roleId: string;
  sessionId: string;
}

/**
 * Shared logic to authenticate a request.
 * Checks JWT signature and session status in the database via Use Case.
 */
export async function authenticateRequest(
  request: NextRequest
): Promise<AuthenticationContext> {
  const authHeader = request.headers.get('authorization');
  let token = request.cookies.get('access_token')?.value;

  // Prioritize Authorization Header.
  if (authHeader) {
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      token = authHeader.substring(7).trim();
    } else {
      // Fallback for tools/clients that might send the token directly without "Bearer".
      token = authHeader.trim();
    }
  }

  if (!token) {
    throw new InvalidTokenError('Authentication token is missing.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  const result = await validateSessionUseCase.execute({ token });

  return result;
}
