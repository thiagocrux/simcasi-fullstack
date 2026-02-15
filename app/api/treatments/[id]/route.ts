import { NextResponse } from 'next/server';

import {
  makeDeleteTreatmentUseCase,
  makeGetTreatmentByIdUseCase,
  makeUpdateTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/treatments/[id]
 * Retrieves a single treatment record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the treatment data.
 */
export const GET = withAuthentication(
  ['read:treatment'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeGetTreatmentByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);

/**
 * [PATCH] /api/treatments/[id]
 * Updates an existing treatment record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the updated treatment.
 */
export const PATCH = withAuthentication(
  ['update:treatment'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateTreatmentUseCase();
    const updated = await useCase.execute({
      id,
      ...body,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/treatments/[id]
 * Performs a soft delete on a treatment record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A response confirming deletion (204 No Content).
 */
export const DELETE = withAuthentication(
  ['delete:treatment'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const useCase = makeDeleteTreatmentUseCase();
    await useCase.execute({
      id,
    });

    return new NextResponse(null, { status: 204 });
  }
);
