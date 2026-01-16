import { NextResponse } from 'next/server';

import {
  makeFindObservationsUseCase,
  makeRegisterObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:observation'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const useCase = makeFindObservationsUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search: searchParams.get('search') || undefined,
    patientId: searchParams.get('patientId') || undefined,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

export const POST = withAuthentication(
  ['create:observation'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterObservationUseCase();

    const observation = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(observation, { status: 201 });
  }
);
