import { NextRequest, NextResponse } from 'next/server';

import { makeValidatePasswordResetTokenUseCase } from '@/core/infrastructure/factories/user.factory';
import { requestContextStore } from '@/core/infrastructure/lib/request-context';
import { handleApiError } from '@/lib/api.utils';

/**
 * [GET] /api/auth/validate-reset-token
 * Verifies if the provided recovery token remains valid, non-used, and non-expired.
 *
 * @param request The incoming Next.js request.
 * @return An object containing the validity status and associated email if valid.
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');

    if (!token) {
      return NextResponse.json(
        {
          name: 'ValidationError',
          message: 'O token é obrigatório.',
          code: 'TOKEN_REQUIRED',
        },
        { status: 400 }
      );
    }

    const useCase = makeValidatePasswordResetTokenUseCase();
    const ipAddress = request.headers.get('x-forwarded-for') || 'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Validation is a read-only audit-less event, but still runs in context for standard error handling.
    const result = await requestContextStore.run(
      {
        userId: '',
        roleId: '',
        roleCode: '',
        ipAddress,
        userAgent,
      },
      () => useCase.execute({ token })
    );

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
