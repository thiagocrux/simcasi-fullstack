import { NextResponse } from 'next/server';

import {
  makeFindSessionsUseCase,
  makeRevokeAllSessionsUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/sessions
 * Retrieves a paginated list of session records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of sessions and metadata.
 */
export const GET = withAuthentication(['read:session'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindSessionsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [DELETE] /api/sessions
 * Revokes all active sessions for a given user.
 * @param request The incoming Next.js request.
 * @return A promise resolving to a success flag.
 */
export const DELETE = withAuthentication(
  ['delete:session'],
  async (request) => {
    const body = await request.json();
    const useCase = makeRevokeAllSessionsUseCase();
    const result = await useCase.execute({ userId: body.userId });

    return NextResponse.json(result);
  }
);
