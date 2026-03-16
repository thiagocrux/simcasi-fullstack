import { decodeJwt } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Returns true if the given JWT has passed its expiration time.
 * Uses a plain decode (no signature verification) to read the `exp` claim,
 * which is safe here since we are not making trust decisions based on this check —
 * we are only deciding whether to proactively refresh before forwarding the request.
 */
function isTokenExpired(token: string): boolean {
  try {
    const { exp } = decodeJwt(token);
    if (!exp) return false;
    return Math.floor(Date.now() / 1000) >= exp;
  } catch {
    // Malformed tokens are treated as expired so the refresh path is attempted.
    return true;
  }
}

/**
 * Replaces (or inserts) a named cookie in a raw `Cookie` request-header string.
 * This is needed to forward the new access_token to the app without redirecting.
 */
function replaceRequestCookie(
  cookieHeader: string | null,
  name: string,
  value: string
): string {
  const cookies = (cookieHeader ?? '')
    .split(';')
    .map((c) => c.trim())
    .filter(Boolean);
  const others = cookies.filter((c) => !c.startsWith(`${name}=`));
  return [...others, `${name}=${value}`].join('; ');
}

/**
 * Next.js Proxy (Edge Middleware)
 * Centralized entry point for authentication and route protection.
 * Runs on the Edge Runtime for low-latency, pre-server checks.
 *
 * Key Principle: Proactively rotate expired tokens at the edge so that RSCs and
 * Server Actions always receive a valid access token. This prevents the DB-cookie
 * state mismatch that causes "Security breach: Token reuse detected" errors.
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
    // For UI requests, redirect to login page.
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // 4. Proactive token refresh.
  // If the access token is expired but a refresh token exists, rotate the session
  // here in the middleware — before the request reaches the app layer.
  //
  // Why here and not in the HOF?
  // Server Components (GET renders) run in a read-only cookie context: they can
  // read cookies but cannot write Set-Cookie headers in the response, so the HOF's
  // cookie persistence silently fails. The middleware has full read/write access
  // to both request and response headers, making it the correct place to rotate.
  if (token && isTokenExpired(token) && refreshToken) {
    try {
      const refreshUrl = new URL('/api/auth/refresh', request.url);
      const refreshResponse = await fetch(refreshUrl.toString(), {
        method: 'POST',
        // Pass only the refresh_token to the internal refresh endpoint.
        // The endpoint reads it either from the cookie header or the request body.
        headers: { cookie: `refresh_token=${refreshToken}` },
      });

      if (refreshResponse.ok) {
        const data = await refreshResponse.json();
        const newAccessToken: string = data.accessToken;

        // Inject the new access_token into the forwarded request headers so the
        // app layer (RSCs, Server Actions) sees the fresh token immediately.
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set(
          'cookie',
          replaceRequestCookie(
            request.headers.get('cookie'),
            'access_token',
            newAccessToken
          )
        );

        const response = NextResponse.next({
          request: { headers: requestHeaders },
        });

        // Derive the cookie maxAge from the token's own `exp` claim so we stay
        // consistent with the token provider's configuration.
        const { exp: accessExp } = decodeJwt(newAccessToken);
        const accessMaxAge = accessExp
          ? accessExp - Math.floor(Date.now() / 1000)
          : undefined;

        // Persist the new access_token in the browser.
        response.cookies.set('access_token', newAccessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          path: '/',
          ...(accessMaxAge !== undefined ? { maxAge: accessMaxAge } : {}),
        });

        // Persist the rotated refresh_token in the browser.
        // The session in the DB has already been rotated by the refresh endpoint,
        // so it is critical that the browser receives the new refresh_token here.
        if (data.refreshToken) {
          const refreshMaxAge =
            data.rememberMe && data.refreshTokenExpiresIn
              ? data.refreshTokenExpiresIn
              : undefined;

          response.cookies.set('refresh_token', data.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            path: '/',
            ...(refreshMaxAge !== undefined ? { maxAge: refreshMaxAge } : {}),
          });
        }

        return response;
      }
    } catch {
      // Refresh failed silently. Fall through and let the backend's own retry
      // logic (withSecuredActionAndAutomaticRetry) handle it for Server Actions.
    }
  }

  // 5. Authenticated or refreshable session: allow request to proceed.
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
