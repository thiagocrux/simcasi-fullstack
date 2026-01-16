import { NextResponse } from 'next/server';

import { makeRestoreExamUseCase } from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api-utils';

export const POST = withAuthentication(
  ['update:exam'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const restoreUseCase = makeRestoreExamUseCase();
    const restored = await restoreUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(restored);
  }
);
