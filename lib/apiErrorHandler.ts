import { AppError } from '@/core/domain/errors/app.error';
import { NextResponse } from 'next/server';

/**
 * Standard error handler for Next.js API Route Handlers.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function handleApiError(error: any) {
  if (error instanceof AppError) {
    return NextResponse.json(
      { message: error.message, code: error.code },
      { status: error.statusCode }
    );
  }

  // Handle specific JWT/Jose errors if needed, or other common generic errors
  if (error.code === 'ERR_JWT_EXPIRED') {
    return NextResponse.json(
      { message: 'Token has expired', code: 'INVALID_TOKEN' },
      { status: 401 }
    );
  }

  console.error('[API_ERROR]', error);

  return NextResponse.json(
    { message: 'Internal server error', code: 'INTERNAL_ERROR' },
    { status: 500 }
  );
}
