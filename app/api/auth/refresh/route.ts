import { AppError } from '@/core/domain/errors/app.error';
import { makeRefreshTokenUseCase } from '@/core/infrastructure/factories/session.factory';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
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
    response.cookies.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error('[REFRESH_API_ERROR]', error);
    return NextResponse.json(
      { message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
