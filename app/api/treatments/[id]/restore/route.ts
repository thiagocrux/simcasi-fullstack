import { NextResponse } from 'next/server';

import { makeRestoreTreatmentUseCase } from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api-utils';

export const POST = withAuthentication(
  ['update:treatment'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeRestoreTreatmentUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
