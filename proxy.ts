import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Proxy (previously Middleware).
 * Acts as a centralized entry point to handle authentication and route protection.
 * Runs on the Edge Runtime.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Define public routes that do not require authentication.
  const isPublicPage = pathname.startsWith('/auth');
  const isPublicApi = pathname.startsWith('/api/auth');
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');

  if (isPublicPage || isPublicApi || isStaticFile) {
    return NextResponse.next();
  }

  // 2. Token verification (Simplified for Proxy/Edge performance).
  // We check for the presence of the access token cookie to decide on redirection.
  // Full session validation is performed at the Use Case level (Application Layer).
  const token = request.cookies.get('access_token')?.value;

  if (!token) {
    // Return 401 Unauthorized for API requests.
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { message: 'Authentication token is missing.' },
        { status: 401 }
      );
    }
    // Redirect to sign-in page for UI requests.
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico).*)',
  ],
};
