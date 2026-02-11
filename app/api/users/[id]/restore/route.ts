import { NextResponse } from 'next/server';

import { makeRestoreUserUseCase } from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/users/[id]/restore
 * Restores a previously soft-deleted user record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A response confirming restoration (204 No Content).
 */
export const PATCH = withAuthentication(
  ['update:user'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeRestoreUserUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
