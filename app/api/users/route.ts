import { NextResponse } from 'next/server';

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
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindUsersUseCase();
  const result = await useCase.execute(searchParams);

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
