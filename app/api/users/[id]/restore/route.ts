import { NextResponse } from 'next/server';

import { makeRestoreUserUseCase } from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * PATCH - /api/users/[id]/restore
 * Restore a soft-deleted user
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
