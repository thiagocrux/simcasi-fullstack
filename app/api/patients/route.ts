import { NextResponse } from 'next/server';

import {
  makeFindPatientsUseCase,
  makeRegisterPatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api-utils';

/**
 * GET /api/patients
 * List patients (Requires view permission)
 */
export const GET = withAuthentication(['read:patient'], async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || undefined;

  const findPatientsUseCase = makeFindPatientsUseCase();
  const result = await findPatientsUseCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

/**
 * POST /api/patients
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
