import { NextRequest, NextResponse } from 'next/server';

import { AppError } from '@/core/domain/errors/app.error';
import { makeLoginUseCase } from '@/core/infrastructure/factories/session.factory';

/**
 * POST - /api/auth/login
 * Authenticate user and create a session
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const loginUseCase = makeLoginUseCase();

    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    const result = await loginUseCase.execute({
      email: body.email,
      password: body.password,
      ipAddress,
      userAgent,
    });

    const response = NextResponse.json(result);

    // Set Refresh Token in an HTTP-only cookie for Web clients
    response.cookies.set('refresh_token', result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      // Max age should match the token provider's refresh expiry.
      // For now, let's set a reasonable default or leave it to the session.
    });

    return response;
  } catch (error) {
    if (error instanceof AppError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      );
    }

    console.error('[LOGIN_API_ERROR]', error);
    return NextResponse.json(
      { message: 'Internal server error', code: 'INTERNAL_ERROR' },
      { status: 500 }
    );
  }
}
