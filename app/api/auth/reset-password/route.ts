import { NextRequest, NextResponse } from 'next/server';

import { makeResetPasswordUseCase } from '@/core/infrastructure/factories/user.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { handleApiError } from '@/lib/api.utils';

/**
 * [POST] /api/auth/reset-password
 * Updates the user password using a valid and non-expired recovery token.
 *
 * @param request The incoming Next.js request.
 * @return Details of the user whose password was reset.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const useCase = makeResetPasswordUseCase();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // The reset process happens within an unauthenticated context until tokens are issued.
    // The user identity is resolved inside the Use Case during token verification.
    const result = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () =>
        useCase.execute({
          token: body.token,
          newPassword: body.newPassword,
        })
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
