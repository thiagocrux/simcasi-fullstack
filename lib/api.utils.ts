/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

import { AppError } from '@/core/domain/errors/app.error';
import { makeRefreshTokenUseCase } from '@/core/infrastructure/factories/session.factory';
import {
  AuthenticationContext,
  authenticateRequest,
} from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { getAuditMetadata } from './actions.utils';

type ApiHandler = (
  request: NextRequest,
  context: {
    params: any;
    auth: AuthenticationContext & {
      ipAddress: string;
      userAgent: string;
    };
  }
) => Promise<NextResponse>;

/**
 * Standard error handler for Next.js API Route Handlers.
 */
export function handleApiError(error: any) {
  // Use property check as a fallback for instanceof, common in Next.js HMR/Turbopack.
  const isAppError =
    error instanceof AppError || (error?.statusCode && error?.code);

  if (isAppError) {
    const statusCode = error.statusCode || 400;

    if (statusCode === 500) {
      console.error('[API_ERROR_500]', error);
    }

    return NextResponse.json(
      {
        name: error.name || 'AppError',
        message: error.message,
        code: error.code,
        errors: (error as any).errors,
      },
      { status: statusCode }
    );
  }

  // Handle specific JWT/Jose errors if needed, or other common generic errors.
  if (error.code === 'ERR_JWT_EXPIRED' || error.name === 'JWTExpired') {
    return NextResponse.json(
      {
        name: 'UnauthorizedError',
        message: 'Your session has expired. Please log in again.',
        code: 'SESSION_EXPIRED',
      },
      { status: 401 }
    );
  }

  console.error('[API_INTERNAL_ERROR]', error);

  return NextResponse.json(
    {
      name: 'InternalServerError',
      message: 'Internal server error',
      code: 'INTERNAL_ERROR',
    },
    { status: 500 }
  );
}

/**
 * Wrapper for API Route Handlers that require Authentication and Authorization.
 * Standardizes security checks and error handling.
 *
 * @param permissions - List of required permissions.
 * @param handler - The route handler business logic.
 */
export function withAuthentication(permissions: string[], handler: ApiHandler) {
  return async (request: NextRequest, { params }: { params: any }) => {
    const execute = async (tokenOverride?: string) => {
      const authContext = await authenticateRequest(
        tokenOverride
          ? new NextRequest(request, {
              headers: {
                ...Object.fromEntries(request.headers),
                authorization: `Bearer ${tokenOverride}`,
              },
            })
          : request
      );
      await authorize(authContext.roleId, permissions);
      const { ipAddress, userAgent } = await getAuditMetadata();

      return await handler(request, {
        params,
        auth: {
          ...authContext,
          ipAddress,
          userAgent,
        },
      });
    };

    try {
      return await execute();
    } catch (caughtError: any) {
      // 1. Check for token expiration at any point during execution
      const isTokenExpired =
        caughtError.code === 'ERR_JWT_EXPIRED' ||
        caughtError.name === 'JWTExpired' ||
        caughtError.message?.toLowerCase().includes('expired') ||
        (caughtError.statusCode === 401 &&
          caughtError.code === 'INVALID_TOKEN');

      if (isTokenExpired) {
        const cookieStore = await cookies();
        const refreshToken = cookieStore.get('refresh_token')?.value;

        if (refreshToken) {
          try {
            const refreshTokenUseCase = makeRefreshTokenUseCase();
            const { ipAddress, userAgent } = await getAuditMetadata();

            const {
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
            } = await refreshTokenUseCase.execute({
              refreshToken,
              ipAddress,
              userAgent,
            });

            // Set new cookies.
            cookieStore.set('access_token', newAccessToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 15,
            });

            cookieStore.set('refresh_token', newRefreshToken, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'lax',
              path: '/',
              maxAge: 60 * 60 * 24 * 7,
            });

            // Retry original handler with the new access token.
            return await execute(newAccessToken);
          } catch (refreshError: any) {
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
            return handleApiError(refreshError);
          }
        }
      }

      return handleApiError(caughtError);
    }
  };
}
