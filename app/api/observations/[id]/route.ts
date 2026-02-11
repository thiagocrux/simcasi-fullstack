import { NextResponse } from 'next/server';

import {
  makeDeleteObservationUseCase,
  makeGetObservationByIdUseCase,
  makeUpdateObservationUseCase,
} from '@/core/infrastructure/factories/observation.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/observations/[id]
 * Retrieves a single observation record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters.
 * @return A promise resolving to the observation data.
 */
export const GET = withAuthentication(
  ['read:observation'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetObservationByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/observations/[id]
 * Updates an existing observation record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A promise resolving to the updated observation.
 */
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

/**
 * [DELETE] /api/observations/[id]
 * Performs a soft delete on an observation record.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters and auth metadata.
 * @return A response confirming deletion (204 No Content).
 */
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
