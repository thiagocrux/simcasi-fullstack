import { makeLogoutUseCase } from '@/core/infrastructure/factories/session.factory';
import { JoseTokenProvider } from '@/core/infrastructure/providers/jose-token.provider';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // 1. Get token from header or cookie
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

    // 2. Decode to get sid (Session ID)
    const tokenProvider = new JoseTokenProvider();
    const decoded = await tokenProvider.verifyToken<{ sid: string }>(token);

    if (decoded?.sid) {
      const logoutUseCase = makeLogoutUseCase();
      await logoutUseCase.execute({ sessionId: decoded.sid });
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });

    // 3. Clear cookies
    response.cookies.delete('refresh_token');
    response.cookies.delete('access_token'); // Just in case it was used

    return response;
  } catch (error) {
    console.error('[LOGOUT_API_ERROR]', error);
    // Even if it fails, we return 200 to the client as the local session should be cleared
    return NextResponse.json({ message: 'Logged out' }, { status: 200 });
  }
}
