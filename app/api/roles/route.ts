import { NextResponse } from 'next/server';

import {
  makeFindRolesUseCase,
  makeRegisterRoleUseCase,
} from '@/core/infrastructure/factories/role.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/roles
 * Retrieves a paginated list of role records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of roles and metadata.
 */
export const GET = withAuthentication(['read:role'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindRolesUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/roles
 * Registers a new role record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context containing auth metadata.
 * @return A promise resolving to the created role record.
 */
export const POST = withAuthentication(
  ['create:role'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterRoleUseCase();
    const role = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(role, { status: 201 });
  }
);
