/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies, headers } from 'next/headers';

import { AppError } from '@/core/domain/errors/app.error';
import { InvalidTokenError } from '@/core/domain/errors/session.error';
import { makeTokenProvider } from '@/core/infrastructure/factories/security.factory';
import {
  makeRefreshTokenUseCase,
  makeValidateSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { AuthenticationContext } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';

/**
 * Encapsulates the standard response structure for all Server Actions.
 *
 * @template T The type of data returned on success.
 */
export type ActionResponse<T> =
  | {
      /** Indicates the operation was successful. */
      success: true;
      /** The resulting payload. */
      data: T;
      /** Optional success message. */
      message?: string;
    }
  | {
      /** Indicates the operation failed. */
      success: false;
      /** The technical name of the error. */
      name: string;
      /** User-friendly error message. */
      message: string;
      /** Standardized error code. */
      code: string;
      /** Optional detailed validation errors (e.g., from Zod). */
      errors?: Record<string, string[]>;
    };

import { logger } from './logger.utils';

/**
 * Standard error handler for Server Actions.
 *
 * Converts caught exceptions into a standardized `ActionResponse`.
 *
 * @param caughtError The error object caught in a try-catch block.
 * @return A standardized failure response.
 */
export function handleActionError(caughtError: any): ActionResponse<never> {
  // Use property checking as a fallback for instanceof. This is necessary because
  // Next.js Hot Module Replacement (HMR) or Turbopack may sometimes lose class
  // identity during reloads, causing `instanceof` to fail.
  const isAppError =
    caughtError instanceof AppError ||
    (caughtError?.statusCode && caughtError?.code);

  if (isAppError) {
    return {
      success: false,
      name: caughtError.name || 'AppError',
      message: caughtError.message,
      code: caughtError.code,
      errors: (caughtError as any).errors,
    };
  }

  // Explicitly handle JWT expiration if it bypasses the retry logic (e.g., multiple fails).
  if (
    caughtError.code === 'ERR_JWT_EXPIRED' ||
    caughtError.name === 'JWTExpired'
  ) {
    return {
      success: false,
      name: 'UnauthorizedError',
      message: 'Sua sessão expirou. Por favor, faça login novamente.',
      code: 'SESSION_EXPIRED',
    };
  }

  console.error('[ACTION_ERROR]', caughtError);

  return {
    success: false,
    name: 'InternalServerError',
    message: caughtError.message || 'Erro interno do servidor.',
    code: 'INTERNAL_ERROR',
  };
}

/**
 * Extracts audit metadata from request headers.
 *
 * @return An object containing the client IP address and user agent.
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
 * Validates the authentication state of a Server Action.
 *
 * Checks for a valid JWT in cookies or the Authorization header.
 *
 * @param overriddenToken Optional token to bypass standard lookup (used for retries).
 * @return The authentication context containing user and role data.
 * @throws {InvalidTokenError} If no valid session is found.
 */
export async function authenticateAction(
  overriddenToken?: string
): Promise<AuthenticationContext> {
  const cookieStore = await cookies();
  const headerList = await headers();

  const authorizationHeader = headerList.get('authorization');
  let accessToken = overriddenToken || cookieStore.get('access_token')?.value;

  if (
    !overriddenToken &&
    authorizationHeader?.toLowerCase().startsWith('bearer ')
  ) {
    accessToken = authorizationHeader.substring(7);
  }

  if (!accessToken) {
    throw new InvalidTokenError('Sessão não encontrada.');
  }

  const validateSessionUseCase = makeValidateSessionUseCase();
  return await validateSessionUseCase.execute({ token: accessToken });
}

/**
 * Higher-order function to execute Server Actions with built-in security,
 * auditing via AsyncLocalStorage, and resilience via automatic retry.
 *
 * Resilience Strategy (Automatic Retry):
 * If the execution fails due to an expired session (InvalidTokenError), this wrapper
 * attempts to silently refresh the session using the HTTP-only refresh token.
 * If successful, it retries the original action exactly once.
 *
 * Security & Auditing Workflow:
 * 1. Authenticates the initial session.
 * 2. Authorizes access based on required permissions.
 * 3. Injects user identity and audit metadata into the `AsyncLocalStorage` store.
 * 4. Executes the business logic within the established context.
 *
 * @template T The return type of the business logic function.
 * @param permissions List of required permission slugs.
 * @param actionFn The business logic function to execute.
 * @return A standardized `ActionResponse` with data or error details.
 */
export async function withSecuredActionAndAutomaticRetry<T>(
  permissions: string[],
  actionFn: (
    context: AuthenticationContext & {
      ipAddress: string;
      userAgent: string;
    }
  ) => Promise<T>
): Promise<ActionResponse<T>> {
  const execute = async (overriddenToken?: string) => {
    const authenticationContext = await authenticateAction(overriddenToken);
    await authorize(authenticationContext.roleId, permissions);
    const { ipAddress, userAgent } = await getAuditMetadata();

    // Establish the Request Context for infrastructure auditing.
    return await requestContextStore.run(
      {
        userId: authenticationContext.userId,
        roleId: authenticationContext.roleId,
        roleCode: authenticationContext.roleCode,
        ipAddress,
        userAgent,
      },
      () =>
        actionFn({
          ...authenticationContext,
          ipAddress,
          userAgent,
        })
    );
  };

  try {
    const actionResult = await execute();
    return {
      success: true,
      data: actionResult,
    };
  } catch (caughtError: any) {
    // Check for token expiration signals across various error formats.
    const isTokenExpired =
      caughtError.code === 'ERR_JWT_EXPIRED' ||
      caughtError.name === 'JWTExpired' ||
      caughtError.message?.toLowerCase().includes('expired') ||
      caughtError.message?.toLowerCase().includes('expirou') ||
      (caughtError.statusCode === 401 &&
        (caughtError.code === 'INVALID_TOKEN' ||
          caughtError.code === 'SESSION_EXPIRED'));

    if (isTokenExpired) {
      logger.warn(
        '[AUTH] Expired or invalid access token detected. Attempting retry...',
        caughtError.message
      );

      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refresh_token')?.value;

      if (refreshToken) {
        logger.info(
          '[RETRY] Refresh token found. Initiating silent renovation...'
        );
        try {
          const refreshTokenUseCase = makeRefreshTokenUseCase();
          const { ipAddress, userAgent } = await getAuditMetadata();

          // Identity fields are intentionally set to empty strings because the authentication
          // is currently in progress. This ensures the Audit System (via AsyncLocalStorage)
          // has a valid context to record the event, documenting an anonymous or
          // pending-identity operation as required by the system governance.
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await requestContextStore.run(
              {
                userId: '',
                roleId: '',
                roleCode: '',
                ipAddress,
                userAgent,
              },
              () =>
                refreshTokenUseCase.execute({
                  refreshToken,
                })
            );

          logger.success('[REFRESH] Token successfully renewed.');

          // Persist new tokens. Note: This may throw if called from inside a RSC.
          try {
            const tokenProvider = makeTokenProvider();
            cookieStore.set('access_token', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: tokenProvider.getAccessExpirationInSeconds(),
            });

            cookieStore.set('refresh_token', newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: tokenProvider.getRefreshExpirationInSeconds(),
            });
          } catch (cookieError: any) {
            logger.warn(
              '[COOKIE] Token persistence failed (likely due to Server Component context):',
              cookieError.message
            );
          }

          // Retry the original action with the newly obtained token.
          logger.info('[RETRY] Re-executing original action...');
          const retryResult = await execute(newAccessToken);
          logger.success('[RETRY] Action re-executed successfully.');

          return {
            success: true,
            data: retryResult,
          };
        } catch (refreshError: any) {
          logger.error(
            '[REFRESH_TOKEN] Session renovation failed:',
            refreshError.message
          );

          // Full session failure: clear invalid cookies if possible.
          try {
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
          } catch (cookieDeleteError: any) {
            logger.warn(
              '[COOKIE] Failed to remove cookies:',
              cookieDeleteError.message
            );
          }
        }
      } else {
        logger.warn('[RETRY] No refresh token found in cookies.');
      }
    }

    return handleActionError(caughtError);
  }
}
