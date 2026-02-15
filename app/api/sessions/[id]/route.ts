import { NextResponse } from 'next/server';

import { makeRevokeSessionUseCase } from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [DELETE] /api/sessions/[id]
 * Revokes a specific session record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to a success flag.
 */
export const DELETE = withAuthentication(
  ['delete:session'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const revokeUseCase = makeRevokeSessionUseCase();
    await revokeUseCase.execute({ id });

    return NextResponse.json({ success: true });
  }
);
