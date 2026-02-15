import { NextResponse } from 'next/server';

import {
  makeFindUsersUseCase,
  makeRegisterUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/users
 * Retrieves a paginated list of user records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of users and metadata.
 */
export const GET = withAuthentication(['read:user'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindUsersUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/users
 * Registers a new user record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context.
 * @return A promise resolving to the created user record.
 */
export const POST = withAuthentication(['create:user'], async (request) => {
  const body = await request.json();
  const useCase = makeRegisterUserUseCase();
  const user = await useCase.execute(body);

  return NextResponse.json(user, { status: 201 });
});
