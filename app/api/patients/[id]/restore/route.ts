import { NextResponse } from 'next/server';

import { makeRestorePatientUseCase } from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/patients/[id]/restore
 * Restores a previously soft-deleted patient record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the restored patient record.
 */
export const PATCH = withAuthentication(
  ['update:patient'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const restoreUseCase = makeRestorePatientUseCase();
    const restored = await restoreUseCase.execute({
      id,
    });

    return NextResponse.json(restored);
  }
);
