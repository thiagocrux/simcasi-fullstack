import { NextResponse } from 'next/server';

import {
  makeGetSessionByIdUseCase,
  makeRevokeSessionUseCase,
} from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/sessions/[id]
 * Retrieves a specific session record by its ID.
 * @param _request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the session data.
 */
export const GET = withAuthentication(
  ['read:session'],
  async (_request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetSessionByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [DELETE] /api/sessions/[id]
 * Revokes a specific session record.
 * @param _request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to a success flag.
 */
export const DELETE = withAuthentication(
  ['delete:session'],
  async (_request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const revokeUseCase = makeRevokeSessionUseCase();
    await revokeUseCase.execute({ id });

    return NextResponse.json({ success: true });
  }
);
