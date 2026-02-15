import { NextResponse } from 'next/server';

import {
  makeDeletePatientUseCase,
  makeGetPatientByIdUseCase,
  makeUpdatePatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/patients/[id]
 * Retrieves a single patient record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the patient data.
 */
export const GET = withAuthentication(
  ['read:patient'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const getPatientByIdUseCase = makeGetPatientByIdUseCase();
    const patient = await getPatientByIdUseCase.execute({ id });

    return NextResponse.json(patient);
  }
);

/**
 * [PATCH] /api/patients/[id]
 * Updates an existing patient record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the updated patient record.
 */
export const PATCH = withAuthentication(
  ['update:patient'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const updateUseCase = makeUpdatePatientUseCase();
    const updated = await updateUseCase.execute({
      id,
      ...body,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/patients/[id]
 * Performs a soft delete on a patient record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A response confirming deletion (204 No Content).
 */
export const DELETE = withAuthentication(
  ['delete:patient'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const deleteUseCase = makeDeletePatientUseCase();
    await deleteUseCase.execute({
      id,
    });

    return new NextResponse(null, { status: 204 });
  }
);
