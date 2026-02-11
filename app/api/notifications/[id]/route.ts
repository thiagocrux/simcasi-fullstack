import { NextResponse } from 'next/server';

import {
  makeDeleteNotificationUseCase,
  makeGetNotificationByIdUseCase,
  makeUpdateNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/notifications/[id]
 * Retrieves a single notification record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters.
 * @return A promise resolving to the notification details.
 */
export const GET = withAuthentication(
  ['read:notification'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetNotificationByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/notifications/[id]
 * Updates an existing notification record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A promise resolving to the updated notification.
 */
export const PATCH = withAuthentication(
  ['update:notification'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateNotificationUseCase();
    const updated = await useCase.execute({
      id,
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/notifications/[id]
 * Performs a soft delete on a notification record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A response confirming deletion (204 No Content).
 */
export const DELETE = withAuthentication(
  ['delete:notification'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeDeleteNotificationUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
