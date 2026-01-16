import { NextResponse } from 'next/server';

import {
  makeDeleteTreatmentUseCase,
  makeGetTreatmentByIdUseCase,
  makeUpdateTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/treatments/[id]
 * Get treatment details by ID
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
 * PATCH - /api/treatments/[id]
 * Update treatment information
 */
export const PATCH = withAuthentication(
  ['update:treatment'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const useCase = makeUpdateTreatmentUseCase();

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
 * DELETE - /api/treatments/[id]
 * Soft delete a treatment
 */
export const DELETE = withAuthentication(
  ['delete:treatment'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeDeleteTreatmentUseCase();
    await useCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
