import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
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
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const search = searchParams.get('search') || undefined;
  const patientId = searchParams.get('patientId') || undefined;

  const useCase = makeFindTreatmentsUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    search,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
    patientId,
  });

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
