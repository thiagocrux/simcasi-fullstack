import { NextRequest, NextResponse } from 'next/server';

import { AppError } from '@/core/domain/errors/app.error';
import { makeRefreshTokenUseCase } from '@/core/infrastructure/factories/session.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { logger } from '@/lib/logger.utils';

/**
 * [POST] /api/auth/refresh
 * Refreshes the access token using a valid refresh token.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the new authentication tokens.
 */
export async function POST(request: NextRequest) {
  logger.info('[API] POST /api/auth/refresh - Iniciando renovação de token');

  try {
    let refreshToken = '';
    const cookieToken = request.cookies.get('refresh_token')?.value;
    const body = await request.json().catch(() => ({}));
    const bodyToken = body.refreshToken;

    refreshToken = cookieToken || bodyToken;

    if (!refreshToken) {
      return NextResponse.json(
        {
          message: 'Refresh token is required',
          code: 'REFRESH_TOKEN_REQUIRED',
        },
        { status: 401 }
      );
    }

    const refreshUseCase = makeRefreshTokenUseCase();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Identity fields are intentionally set to empty strings because the authentication
    // is currently in progress. This ensures the Audit System (via AsyncLocalStorage)
    // has a valid context to record the event, documenting an anonymous or
    // pending-identity operation as required by the system governance.
    const result = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () =>
        refreshUseCase.execute({
          refreshToken,
        })
    );

    const response = NextResponse.json(result);
    const cookieOptions: NonNullable<
      Parameters<NextResponse['cookies']['set']>[2]
    > = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    };

    if (result.rememberMe && result.refreshTokenExpiresIn) {
      cookieOptions.maxAge = result.refreshTokenExpiresIn;
    }

    response.cookies.set('refresh_token', result.refreshToken, cookieOptions);

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    logger.error('[REFRESH_API_ERROR]', error);

    return NextResponse.json(
      { message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
