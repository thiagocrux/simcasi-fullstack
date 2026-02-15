import { NextResponse } from 'next/server';

import { makeRestorePermissionUseCase } from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/permissions/[id]/restore
 * Restores a previously soft-deleted permission record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to a no-content response.
 */
export const PATCH = withAuthentication(
  ['update:permission'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeRestorePermissionUseCase();
    await useCase.execute({ id });

    return new NextResponse(null, { status: 204 });
  }
);
