import { NextResponse } from 'next/server';

import {
  makeDeleteRoleUseCase,
  makeGetRoleByIdUseCase,
  makeUpdateRoleUseCase,
} from '@/core/infrastructure/factories/role.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/roles/[id]
 * Retrieves a specific role record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters.
 * @return A promise resolving to the role record.
 */
export const GET = withAuthentication(
  ['read:role'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetRoleByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/roles/[id]
 * Updates an existing role record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A promise resolving to the updated role record.
 */
export const PATCH = withAuthentication(
  ['update:role'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateRoleUseCase();
    const updated = await useCase.execute({
      id,
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/roles/[id]
 * Performs a soft delete on a role record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A promise resolving to a no-content response.
 */
export const DELETE = withAuthentication(
  ['delete:role'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeDeleteRoleUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
