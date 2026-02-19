import { NextRequest, NextResponse } from 'next/server';

import { makeRequestPasswordResetUseCase } from '@/core/infrastructure/factories/user.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { handleApiError } from '@/lib/api.utils';

/**
 * [POST] /api/auth/request-password-reset
 * Initiates the password recovery flow by sending an email with a unique token to the user.
 *
 * @param request The incoming Next.js request.
 * @return A success message confirming the request was processed.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = makeRequestPasswordResetUseCase();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // The password reset request is inherently anonymous until identity is confirmed via token.
    // This allows the audit system to track the event within a valid context.
    const result = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () => useCase.execute({ email: body.email })
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
