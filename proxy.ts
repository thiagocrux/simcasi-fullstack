import { NextRequest, NextResponse } from 'next/server';

/**
 * Next.js Proxy (Edge Middleware)
 * Centralized entry point for authentication and route protection.
 * Runs on the Edge Runtime for low-latency, pre-server checks.
 *
 * Key Principle: Only block requests if BOTH access and refresh tokens are missing.
 * This allows the backend to handle token refresh and session rotation transparently.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Allowlist: Define public routes that do NOT require authentication.
  // These include auth pages, public APIs, docs, health checks, and static assets.
  const isPublicPage = pathname.startsWith('/auth');
  const isPublicApi =
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/docs') ||
    pathname === '/api/health';
  const isStaticFile = pathname.includes('.') || pathname.startsWith('/_next');

  if (isPublicPage || isPublicApi || isStaticFile) {
    return NextResponse.next(); // Skip auth for public resources.
  }

  // 2. Token verification (Edge-optimized)
  // Check for the presence of the access token in cookies or the Authorization header.
  const authHeader = request.headers.get('authorization');
  let token = request.cookies.get('access_token')?.value;

  // Also check for the refresh token.
  // If the access token is missing or expired but a refresh token is present (e.g., "Remember Me"),
  // allow the request to reach the backend. The backend (Server Actions / API Routes) is responsible
  // for handling token expiration, verifying the refresh token, and rotating the session transparently.
  // Blocking here would prevent the backend's retry and refresh logic from running.
  const refreshToken = request.cookies.get('refresh_token')?.value;

  if (!token && authHeader?.toLowerCase().startsWith('bearer ')) {
    token = authHeader.substring(7).trim();
  }

  // 3. Block only if BOTH tokens are missing (no session at all)
  if (!token && !refreshToken) {
    // For API requests, return 401 Unauthorized.
    if (pathname.startsWith('/api')) {
      return NextResponse.json(
        { message: 'Authentication token is missing.' },
        { status: 401 }
      );
    }
    // For UI requests, redirect to sign-in page.
    return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  }

  // 4. Authenticated or refreshable session: allow request to proceed.
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
