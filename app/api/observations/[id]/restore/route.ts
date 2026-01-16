import { NextResponse } from 'next/server';

import { makeRestoreObservationUseCase } from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api-utils';

export const POST = withAuthentication(
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
