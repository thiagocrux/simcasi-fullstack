import { NextResponse } from 'next/server';

import {
  makeFindTreatmentsUseCase,
  makeRegisterTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/treatments
 * List all treatments with pagination and filters
 */
export const GET = withAuthentication(['read:treatment'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindTreatmentsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * POST - /api/treatments
 * Register a new treatment
 */
export const POST = withAuthentication(
  ['create:treatment'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterTreatmentUseCase();

    const treatment = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(treatment, { status: 201 });
  }
);
