/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies, headers } from 'next/headers';

import { AppError } from '@/core/domain/errors/app.error';
import { InvalidTokenError } from '@/core/domain/errors/session.error';
import {
  makeRefreshTokenUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { AuthenticationContext } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';

/**
 * Standard error handler for Server Actions.
 */
export function handleActionError(caughtError: any) {
  if (caughtError instanceof AppError) {
    return {
      success: false,
      message: caughtError.message,
      code: caughtError.code,
      errors: (caughtError as any).errors, // For Zod validation errors if attached
    };
  }

  // Handle JWT expiration explicitly if it escapes authenticateAction refresh attempt
  if (
    caughtError.code === 'ERR_JWT_EXPIRED' ||
    caughtError.name === 'JWTExpired'
  ) {
    return {
      success: false,
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      code: 'SESSION_EXPIRED',
    };
  }

  console.error('[ACTION_ERROR]', caughtError);

  return {
    success: false,
    message: caughtError.message || 'Erro interno do servidor',
    code: 'INTERNAL_ERROR',
  };
}

/**
 * Helper to get audit metadata from headers.
 */
export async function getAuditMetadata() {
  const headerList = await headers();
  const ipAddress = headerList.get('x-forwarded-for') || 'unknown';
  const userAgent = headerList.get('user-agent') || 'unknown';

  return {
    ipAddress,
    userAgent,
  };
}

/**
 * Authenticates a Server Action using cookies or Authorization header.
 * Simply validates the current token. Refresh logic is handled by the wrapper.
 */
export async function authenticateAction(): Promise<AuthenticationContext> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const authorizationHeader = headerList.get('authorization');
  const accessToken =
    authorizationHeader?.replace('Bearer ', '') ||
    cookieStore.get('access_token')?.value;

  if (!accessToken) {
    throw new InvalidTokenError('Sessão não encontrada.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  return await validateSessionUseCase.execute({ token: accessToken });
}

/**
 * Higher-order function to execute Server Actions with built-in security and resilience.
 *
 * Resilience Strategy (Automatic Retry):
 * If the execution fails due to an expired session (InvalidTokenError), this wrapper
 * attempts to silently refresh the session using the refresh token. If successful,
 * it retries the action exactly once transparently for the user.
 *
 * Security Workflow:
 * 1. Authenticates the user session via cookies/headers.
 * 2. Authorizes access based on the required permissions.
 * 3. Injects execution context (userId, ipAddress, userAgent) into the handler.
 *
 * @param permissions - List of required permissions.
 * @param actionFn - The business logic to execute.
 * @returns The result of the action or a standardized error response.
 */
export async function withSecuredActionAndAutomaticRetry<T>(
  permissions: string[],
  actionFn: (
    context: AuthenticationContext & {
      ipAddress: string;
      userAgent: string;
    }
  ) => Promise<T>
) {
  const execute = async () => {
    const authenticationContext = await authenticateAction();
    await authorize(authenticationContext.roleId, permissions);
    const { ipAddress, userAgent } = await getAuditMetadata();

    return await actionFn({
      ...authenticationContext,
      ipAddress,
      userAgent,
    });
  };

  try {
    const actionResult = await execute();
    return {
      success: true,
      data: actionResult,
    };
  } catch (caughtError: any) {
    // 1. Check for token expiration at any point during execution
    const isTokenExpired =
      caughtError.code === 'ERR_JWT_EXPIRED' ||
      caughtError.name === 'JWTExpired' ||
      caughtError.message?.includes('expired');

    if (isTokenExpired) {
      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refresh_token')?.value;

      if (refreshToken) {
        try {
          // Attempt silent refresh
          const refreshTokenUseCase = makeRefreshTokenUseCase();
          const { ipAddress, userAgent } = await getAuditMetadata();

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshTokenUseCase.execute({
              refreshToken,
              ipAddress,
              userAgent,
            });

          // Set new cookies
          cookieStore.set('access_token', newAccessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 15, // 15 minutes
          });

          cookieStore.set('refresh_token', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            maxAge: 60 * 60 * 24 * 7, // 7 days
          });

          // 2. RETRY the original action with the new session
          const retryResult = await execute();
          return {
            success: true,
            data: retryResult,
          };
        } catch (refreshError: any) {
          // If refresh fails, session is dead. Clean up and let catch block handle it.
          cookieStore.delete('access_token');
          cookieStore.delete('refresh_token');
        }
      }
    }

    // 3. Fallback to standard error handling
    return handleActionError(caughtError);
  }
}
