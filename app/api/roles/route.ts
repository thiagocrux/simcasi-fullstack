import { NextResponse } from 'next/server';

import {
  makeFindRolesUseCase,
  makeRegisterRoleUseCase,
} from '@/core/infrastructure/factories/role.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/roles
 * List all roles with pagination and filters
 */
export const GET = withAuthentication(['read:role'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindRolesUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * POST - /api/roles
 * Register a new role
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
