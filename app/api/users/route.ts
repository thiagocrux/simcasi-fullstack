import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
import {
  makeFindUsersUseCase,
  makeRegisterUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/users
 * List all users with pagination and filters
 */
export const GET = withAuthentication(['read:user'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const useCase = makeFindUsersUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search: searchParams.get('search') || undefined,
    roleId: searchParams.get('roleId') || undefined,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

/**
 * POST - /api/users
 * Register a new user
 */
export const POST = withAuthentication(
  ['create:user'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterUserUseCase();
    const user = await useCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(user, { status: 201 });
  }
);
