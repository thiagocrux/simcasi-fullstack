import { NextRequest, NextResponse } from 'next/server';

import { makeLoginUseCase } from '@/core/infrastructure/factories/session.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { handleApiError } from '@/lib/api.utils';

/**
 * [POST] /api/auth/login
 * Authenticates a user and creates a new session.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the authentication result including tokens.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const loginUseCase = makeLoginUseCase();
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
        loginUseCase.execute({
          email: body.email,
          password: body.password,
          rememberMe: body.rememberMe,
        })
    );

    const response = NextResponse.json(result);
    // Set Refresh Token in an HTTP-only cookie for Web clients.
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
    return handleApiError(error);
  }
}
