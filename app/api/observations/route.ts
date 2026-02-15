import { NextResponse } from 'next/server';

import {
  makeFindObservationsUseCase,
  makeRegisterObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/observations
 * Retrieves a paginated list of observation records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of observations and metadata.
 */
export const GET = withAuthentication(['read:observation'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindObservationsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/observations
 * Registers a new observation record in the system.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the created observation record.
 */
export const POST = withAuthentication(
  ['create:observation'],
  async (request) => {
    const body = await request.json();
    const useCase = makeRegisterObservationUseCase();
    const observation = await useCase.execute({
      ...body,
    });

    return NextResponse.json(observation, { status: 201 });
  }
);
