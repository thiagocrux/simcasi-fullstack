import { NextResponse } from 'next/server';

import { makeRestoreRoleUseCase } from '@/core/infrastructure/factories/role.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/roles/[id]/restore
 * Restores a previously soft-deleted role record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to a no-content response.
 */
export const PATCH = withAuthentication(
  ['update:role'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeRestoreRoleUseCase();
    await useCase.execute({ id });

    return new NextResponse(null, { status: 204 });
  }
);
