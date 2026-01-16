import { NextResponse } from 'next/server';

import {
  makeDeleteUserUseCase,
  makeGetUserByIdUseCase,
  makeUpdateUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:user'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeGetUserByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

export const PATCH = withAuthentication(
  ['update:user'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateUserUseCase();

    const updated = await useCase.execute({
      id,
      data: body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(updated);
  }
);

export const DELETE = withAuthentication(
  ['delete:user'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeDeleteUserUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
