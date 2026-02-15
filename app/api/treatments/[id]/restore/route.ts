import { NextResponse } from 'next/server';

import { makeRestoreTreatmentUseCase } from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/treatments/[id]/restore
 * Restores a previously soft-deleted treatment record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A response confirming restoration (204 No Content).
 */
export const PATCH = withAuthentication(
  ['update:treatment'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeRestoreTreatmentUseCase();
    await useCase.execute({
      id,
    });

    return new NextResponse(null, { status: 204 });
  }
);
