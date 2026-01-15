import { NextRequest } from 'next/server';

import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { makeValidateSessionUseCase } from '../factories/session.factory';

export interface AuthContext {
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
): Promise<AuthContext> {
  const authHeader = request.headers.get('authorization');
  const token =
    authHeader?.replace('Bearer ', '') ||
    request.cookies.get('access_token')?.value;

  if (!token) {
    throw new InvalidTokenError('Authentication token is missing.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  const result = await validateSessionUseCase.execute({ token });

  return result;
}
