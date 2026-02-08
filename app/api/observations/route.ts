import { NextResponse } from 'next/server';

import {
  makeFindObservationsUseCase,
  makeRegisterObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/observations
 * List all observations with pagination and filters
 */
export const GET = withAuthentication(['read:observation'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindObservationsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * POST - /api/observations
 * Register a new observation
 */
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
