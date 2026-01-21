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
  if (error instanceof AppError) {
    return NextResponse.json(
      {
        name: error.name,
        message: error.message,
        code: error.code,
      },
      { status: error.statusCode }
    );
  }

  // Handle specific JWT/Jose errors if needed, or other common generic errors
  if (error.code === 'ERR_JWT_EXPIRED') {
    return NextResponse.json(
      {
        message: 'Token has expired',
        code: 'INVALID_TOKEN',
      },
      { status: 401 }
    );
  }

  console.error('[API_ERROR]', error);

  return NextResponse.json(
    {
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
    const execute = async () => {
      const authContext = await authenticateRequest(request);
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
      // Check for token expiration
      const isTokenExpired =
        caughtError.code === 'ERR_JWT_EXPIRED' ||
        caughtError.name === 'JWTExpired' ||
        caughtError.message?.includes('expired');

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

            // Set new cookies
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

            // Retry original handler
            return await execute();
          } catch (refreshError: any) {
            cookieStore.delete('access_token');
            cookieStore.delete('refresh_token');
          }
        }
      }

      return handleApiError(caughtError);
    }
  };
}
