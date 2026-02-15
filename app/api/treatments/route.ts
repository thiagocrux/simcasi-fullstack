import { NextResponse } from 'next/server';

import {
  makeFindTreatmentsUseCase,
  makeRegisterTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/treatments
 * Retrieves a paginated list of treatment records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of treatments and metadata.
 */
export const GET = withAuthentication(['read:treatment'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindTreatmentsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/treatments
 * Registers a new treatment record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context.
 * @return A promise resolving to the created treatment record.
 */
export const POST = withAuthentication(
  ['create:treatment'],
  async (request) => {
    const body = await request.json();
    const useCase = makeRegisterTreatmentUseCase();
    const treatment = await useCase.execute({
      ...body,
    });

    return NextResponse.json(treatment, { status: 201 });
  }
);
