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
 * Standard response structure for Server Actions.
 */
export type ActionResponse<T> =
  | {
      success: true;
      data: T;
      message?: string;
    }
  | {
      success: false;
      name: string;
      message: string;
      code: string;
      errors?: Record<string, string[]>;
    };

/**
 * Standard error handler for Server Actions.
 */
export function handleActionError(caughtError: any): ActionResponse<never> {
  // Use property check as a fallback for instanceof, common in Next.js HMR/Turbopack.
  const isAppError =
    caughtError instanceof AppError ||
    (caughtError?.statusCode && caughtError?.code);

  if (isAppError) {
    return {
      success: false,
      name: caughtError.name || 'AppError',
      message: caughtError.message,
      code: caughtError.code,
      errors: (caughtError as any).errors, // For Zod validation errors if attached.
    };
  }

  // Handle JWT expiration explicitly if it escapes authenticateAction refresh attempt.
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
 *
 * @param overriddenToken - Optional token to bypass cookie/header lookup (useful for retries).
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
): Promise<ActionResponse<T>> {
  const execute = async (overriddenToken?: string) => {
    const authenticationContext = await authenticateAction(overriddenToken);
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
      caughtError.message?.toLowerCase().includes('expired') ||
      caughtError.message?.toLowerCase().includes('expirou') ||
      (caughtError.statusCode === 401 && caughtError.code === 'INVALID_TOKEN');

    if (isTokenExpired) {
      console.warn(
        '[AUTH] Access token expirado/inválido detectado:',
        caughtError.message
      );

      const cookieStore = await cookies();
      const refreshToken = cookieStore.get('refresh_token')?.value;

      if (refreshToken) {
        console.log('[RETRY] Refresh token encontrado. Iniciando renovação...');
        try {
          // Attempt silent refresh
          console.log('[REFRESH_TOKEN] Executando RefreshTokenUseCase...');
          const refreshTokenUseCase = makeRefreshTokenUseCase();
          const { ipAddress, userAgent } = await getAuditMetadata();

          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            await refreshTokenUseCase.execute({
              refreshToken,
              ipAddress,
              userAgent,
            });

          console.log('[REFRESH_TOKEN] Token renovado com sucesso.');

          // Set new cookies (may fail in Server Components/RSC)
          try {
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
          } catch (cookieError: any) {
            console.warn(
              '[COOKIE] Não foi possível persistir os novos tokens (provavelmente RSC):',
              cookieError.message
            );
          }

          // 2. Retry the original action with the new session (pass token directly)
          console.log('[RETRY] Tentando executar a ação original novamente...');
          const retryResult = await execute(newAccessToken);
          console.log('[RETRY] Ação re-executada com sucesso.');

          return {
            success: true,
            data: retryResult,
          };
        } catch (refreshError: any) {
          console.error(
            '[REFRESH_TOKEN] Falha ao renovar token:',
            refreshError.message
          );

          // If refresh fails, session is dead. Clean up cookies (may fail in RSC)
          try {
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
          } catch (cookieDeleteError: any) {
            console.warn(
              '[COOKIE] Não foi possível remover os cookies (provavelmente RSC):',
              cookieDeleteError.message
            );
          }
        }
      } else {
        console.warn('[RETRY] Refresh token não encontrado nos cookies.');
      }
    }

    // 3. Fallback to standard error handling
    return handleActionError(caughtError);
  }
}
