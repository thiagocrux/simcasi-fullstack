import { NextResponse } from 'next/server';

import { makeRevokeSessionUseCase } from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * DELETE - /api/sessions/[id]
 * Revoke a specific session
 */
export const DELETE = withAuthentication(
  ['delete:session'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const revokeUseCase = makeRevokeSessionUseCase();
    await revokeUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json({ success: true });
  }
);
