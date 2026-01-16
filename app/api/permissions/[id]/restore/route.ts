import { NextResponse } from 'next/server';

import { makeRestorePermissionUseCase } from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * POST - /api/permissions/[id]/restore
 * Restore a soft-deleted permission
 */
export const POST = withAuthentication(
  ['update:permission'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeRestorePermissionUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
