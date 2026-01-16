import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
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
    const { searchParams } = new URL(request.url);
    const useCase = makeFindNotificationsUseCase();

    const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
    const limit = Math.min(
      Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
      PAGINATION.MAX_LIMIT
    );

    const result = await useCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      search: searchParams.get('search') || undefined,
      patientId: searchParams.get('patientId') || undefined,
      includeDeleted: searchParams.get('includeDeleted') === 'true',
    });

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
