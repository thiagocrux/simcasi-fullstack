import { NextResponse } from 'next/server';

import {
  makeFindNotificationsUseCase,
  makeRegisterNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/notifications
 * Retrieves a paginated list of notification records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of notifications and metadata.
 */
export const GET = withAuthentication(
  ['read:notification'],
  async (request) => {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const useCase = makeFindNotificationsUseCase();
    const result = await useCase.execute(searchParams);

    return NextResponse.json(result);
  }
);

/**
 * [POST] /api/notifications
 * Registers a new notification record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context containing auth metadata.
 * @return A promise resolving to the created notification record.
 */
export const POST = withAuthentication(
  ['create:notification'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterNotificationUseCase();
    const notification = await useCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(notification, { status: 201 });
  }
);
