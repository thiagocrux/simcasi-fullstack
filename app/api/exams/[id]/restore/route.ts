import { NextResponse } from 'next/server';

import { makeRestoreExamUseCase } from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/exams/[id]/restore
 * Restores a previously soft-deleted exam record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A promise resolving to the restored exam record.
 */
export const PATCH = withAuthentication(
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
