import { NextRequest, NextResponse } from 'next/server';

import { makeLogoutUseCase } from '@/core/infrastructure/factories/session.factory';
import { JoseTokenProvider } from '@/core/infrastructure/providers/token.jose.provider';

/**
 * [POST] /api/auth/logout
 * Invalidates the current user session and clears authentication cookies.
 * @param request The incoming Next.js request.
 * @return A promise resolving to a success message.
 */
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    const token =
      authHeader?.replace('Bearer ', '') ||
      request.cookies.get('access_token')?.value;

    if (!token) {
      return NextResponse.json(
        { message: 'No session active' },
        { status: 200 }
      );
    }

    const tokenProvider = new JoseTokenProvider();
    const decoded = await tokenProvider.verifyToken<{ sid: string }>(token);

    if (decoded?.sid) {
      const logoutUseCase = makeLogoutUseCase();
      await logoutUseCase.execute({ sessionId: decoded.sid });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });

    response.cookies.delete('refresh_token');
    response.cookies.delete('access_token');

    return response;
  } catch (error) {
    console.error('[LOGOUT_API_ERROR]', error);
    return NextResponse.json({ message: 'Logged out' }, { status: 200 });
  }
}
