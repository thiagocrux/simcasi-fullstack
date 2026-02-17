import { NextResponse } from 'next/server';

import { makeChangePasswordUseCase } from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [PATCH] /api/users/change-password
 * Endpoint to change the authenticated user's password.
 *
 * @param request The incoming Next.js request.
 * @param context The request context with authentication data.
 * @return A promise resolving to the updated user record.
 */
export const PATCH = withAuthentication(
  ['update:user'],
  async (request, context) => {
    const body = await request.json();
    const { userId } = context.auth;

    const useCase = makeChangePasswordUseCase();
    const result = await useCase.execute({
      userId,
      currentPassword: body.currentPassword,
      newPassword: body.newPassword,
    });

    return NextResponse.json(result);
  }
);
