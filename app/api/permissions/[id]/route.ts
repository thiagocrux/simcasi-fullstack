import { NextResponse } from 'next/server';

import {
  makeDeletePermissionUseCase,
  makeGetPermissionByIdUseCase,
  makeUpdatePermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/permissions/[id]
 * Get permission details by ID
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
 * PATCH - /api/permissions/[id]
 * Update permission information
 */
export const PATCH = withAuthentication(
  ['update:permission'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdatePermissionUseCase();

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
 * DELETE - /api/permissions/[id]
 * Soft delete a permission
 */
export const DELETE = withAuthentication(
  ['delete:permission'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeDeletePermissionUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
