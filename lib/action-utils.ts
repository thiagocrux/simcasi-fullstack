/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppError } from '@/core/domain/errors/app.error';
import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { makeValidateSessionUseCase } from '@/core/infrastructure/factories/session.factory';
import { AuthContext } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { cookies, headers } from 'next/headers';

/**
 * Standard error handler for Server Actions.
 */
export function handleActionError(error: any) {
  if (error instanceof AppError) {
    return {
      success: false,
      message: error.message,
      code: error.code,
      errors: (error as any).errors, // For Zod validation errors if attached
    };
  }

  if (error.code === 'ERR_JWT_EXPIRED') {
    return {
      success: false,
      message: 'Token has expired',
      code: 'INVALID_TOKEN',
    };
  }

  console.error('[ACTION_ERROR]', error);

  return {
    success: false,
    message: error.message || 'Internal server error',
    code: 'INTERNAL_ERROR',
  };
}

/**
 * Helper to get audit metadata from headers.
 */
export async function getAuditMetadata() {
  const headerList = await headers();
  const ip = headerList.get('x-forwarded-for') || 'unknown';
  const userAgent = headerList.get('user-agent') || 'unknown';

  return { ip, userAgent };
}

/**
 * Authenticates a Server Action using cookies or Authorization header.
 */
export async function authenticateAction(): Promise<AuthContext> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const authHeader = headerList.get('authorization');
  const token =
    authHeader?.replace('Bearer ', '') ||
    cookieStore.get('access_token')?.value;

  if (!token) {
    throw new InvalidTokenError('Authentication token is missing.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  const result = await validateSessionUseCase.execute({ token });

  return result;
}

/**
 * Combined helper for Authentication + Authorization in Server Actions.
 */
export async function protectAction(requiredPermissions: string[]) {
  const auth = await authenticateAction();
  await authorize(auth.roleId, requiredPermissions);
  const metadata = await getAuditMetadata();

  return {
    ...auth,
    ipAddress: metadata.ip,
    userAgent: metadata.userAgent,
  };
}
