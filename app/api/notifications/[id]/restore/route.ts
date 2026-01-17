import { NextResponse } from 'next/server';

import { makeRestoreNotificationUseCase } from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * PATCH - /api/notifications/[id]/restore
 * Restore a soft-deleted notification
 */
export const PATCH = withAuthentication(
  ['update:notification'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const restoreUseCase = makeRestoreNotificationUseCase();
    const restored = await restoreUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(restored);
  }
);
