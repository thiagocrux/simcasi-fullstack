import { NextRequest, NextResponse } from 'next/server';

import { AppError } from '@/core/domain/errors/app.error';
import { makeRefreshTokenUseCase } from '@/core/infrastructure/factories/session.factory';
import { logger } from '@/lib/logger.utils';

/**
 * POST - /api/auth/refresh
 * Refresh access token using a refresh token
 */
export async function POST(request: NextRequest) {
  logger.info('[API] POST /api/auth/refresh - Iniciando renovação de token');

  try {
    let refreshToken = '';

    // 1. Try to get from cookies (Web)
    const cookieToken = request.cookies.get('refresh_token')?.value;

    // 2. Try to get from body (Mobile/Postman)
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

    const result = await refreshUseCase.execute({
      refreshToken,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(result);

    // Update Refresh Token in cookie
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
