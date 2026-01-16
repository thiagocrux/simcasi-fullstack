import { NextResponse } from 'next/server';

import {
  makeFindNotificationsUseCase,
  makeRegisterNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:notification'],
  async (request) => {
    const { searchParams } = new URL(request.url);
    const useCase = makeFindNotificationsUseCase();

    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;

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
