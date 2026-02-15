import { NextResponse } from 'next/server';

import {
  makeDeleteUserUseCase,
  makeGetUserByIdUseCase,
  makeUpdateUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/users/[id]
 * Retrieves a single user record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the user profile data.
 */
export const GET = withAuthentication(
  ['read:user'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetUserByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/users/[id]
 * Updates an existing user record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the updated user record.
 */
export const PATCH = withAuthentication(
  ['update:user'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateUserUseCase();
    const updated = await useCase.execute({
      id,
      ...body,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/users/[id]
 * Performs a soft delete on a user record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A response confirming deletion (204 No Content).
 */
export const DELETE = withAuthentication(
  ['delete:user'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeDeleteUserUseCase();
    await useCase.execute({
      id,
    });

    return new NextResponse(null, { status: 204 });
  }
);
