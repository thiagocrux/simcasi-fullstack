import { NextResponse } from 'next/server';

import {
  makeFindPermissionsUseCase,
  makeRegisterPermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/permissions
 * Retrieves a paginated list of permission records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of permissions and metadata.
 */
export const GET = withAuthentication(['read:permission'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindPermissionsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/permissions
 * Registers a new permission record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context.
 * @return A promise resolving to the created permission record.
 */
export const POST = withAuthentication(
  ['create:permission'],
  async (request) => {
    const body = await request.json();
    const useCase = makeRegisterPermissionUseCase();
    const permission = await useCase.execute(body);

    return NextResponse.json(permission, { status: 201 });
  }
);
