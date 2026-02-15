import { NextResponse } from 'next/server';

import {
  makeDeletePermissionUseCase,
  makeGetPermissionByIdUseCase,
  makeUpdatePermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/permissions/[id]
 * Retrieves a specific permission record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the permission record.
 */
export const GET = withAuthentication(
  ['read:permission'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetPermissionByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/permissions/[id]
 * Updates an existing permission record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the updated permission record.
 */
export const PATCH = withAuthentication(
  ['update:permission'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdatePermissionUseCase();
    const updated = await useCase.execute({
      id,
      ...body,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/permissions/[id]
 * Performs a soft delete on a permission record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to a no-content response.
 */
export const DELETE = withAuthentication(
  ['delete:permission'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeDeletePermissionUseCase();
    await useCase.execute({ id });

    return new NextResponse(null, { status: 204 });
  }
);
