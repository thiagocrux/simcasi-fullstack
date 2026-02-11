import { NextResponse } from 'next/server';

import {
  makeFindPatientsUseCase,
  makeRegisterPatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/patients
 * Retrieves a paginated list of patient records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of patients and pagination metadata.
 */
export const GET = withAuthentication(['read:patient'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindPatientsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/patients
 * Registers a new patient record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context containing auth metadata.
 * @return A promise resolving to the created patient record.
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
