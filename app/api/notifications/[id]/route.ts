import { NextResponse } from 'next/server';

import {
  makeDeleteNotificationUseCase,
  makeGetNotificationByIdUseCase,
  makeUpdateNotificationUseCase,
} from '@/core/infrastructure/factories/notification.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:notification'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeGetNotificationByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

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
