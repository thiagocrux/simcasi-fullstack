import { NextResponse } from 'next/server';

import {
  makeFindPatientsUseCase,
  makeRegisterPatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/patients
 * List patients (Requires view permission)
 */
export const GET = withAuthentication(['read:patient'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindPatientsUseCase();
  const result = await useCase.execute(searchParams);

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
