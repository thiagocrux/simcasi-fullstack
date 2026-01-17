import { NextResponse } from 'next/server';

import { makeRestorePatientUseCase } from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * PATCH - /api/patients/[id]/restore
 * Restore a soft-deleted patient
 */
export const PATCH = withAuthentication(
  ['update:patient'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const restoreUseCase = makeRestorePatientUseCase();
    const restored = await restoreUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(restored);
  }
);
