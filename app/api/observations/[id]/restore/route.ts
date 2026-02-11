import { NextResponse } from 'next/server';

import { makeRestoreObservationUseCase } from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/observations/[id]/restore
 * Restores a previously soft-deleted observation record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A response confirming restoration (204 No Content).
 */
export const PATCH = withAuthentication(
  ['update:observation'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeRestoreObservationUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
