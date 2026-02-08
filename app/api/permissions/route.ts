import { NextResponse } from 'next/server';

import {
  makeFindPermissionsUseCase,
  makeRegisterPermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/permissions
 * List all permissions with pagination and filters
 */
export const GET = withAuthentication(['read:permission'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindPermissionsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * POST - /api/permissions
 * Register a new permission
 */
export const POST = withAuthentication(
  ['create:permission'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterPermissionUseCase();

    const permission = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(permission, { status: 201 });
  }
);
