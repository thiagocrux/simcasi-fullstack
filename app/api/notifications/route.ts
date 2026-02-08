import { NextResponse } from 'next/server';

import {
  makeFindNotificationsUseCase,
  makeRegisterNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/notifications
 * List all notifications with pagination and filters
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
 * POST - /api/notifications
 * Register a new notification
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
