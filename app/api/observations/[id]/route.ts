import { NextResponse } from 'next/server';

import {
  makeDeleteObservationUseCase,
  makeGetObservationByIdUseCase,
  makeUpdateObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:observation'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeGetObservationByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

export const PATCH = withAuthentication(
  ['update:observation'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateObservationUseCase();

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
  ['delete:observation'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeDeleteObservationUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
