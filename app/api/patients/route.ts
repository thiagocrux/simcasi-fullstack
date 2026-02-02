import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
import {
  makeFindPatientsUseCase,
  makeRegisterPatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { parseDateFilters, withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/patients
 * List patients (Requires view permission)
 */
export const GET = withAuthentication(['read:patient'], async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  const findPatientsUseCase = makeFindPatientsUseCase();
  const result = await findPatientsUseCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    search: searchParams.get('search') || undefined,
    searchBy: searchParams.get('searchBy') || undefined,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
    ...parseDateFilters(searchParams),
  });

  return NextResponse.json(result);
});

/**
 * POST - /api/patients
 * Register a new patient (Requires create permission + Audit)
 */
export const POST = withAuthentication(
  ['create:patient'],
  async (request, { auth }) => {
    const body = await request.json();
    const registerUseCase = makeRegisterPatientUseCase();

    const patient = await registerUseCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(patient, { status: 201 });
  }
);
