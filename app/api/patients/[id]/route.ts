import { NextResponse } from 'next/server';

import {
  makeDeletePatientUseCase,
  makeGetPatientByIdUseCase,
  makeUpdatePatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:patient'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const getPatientByIdUseCase = makeGetPatientByIdUseCase();
    const patient = await getPatientByIdUseCase.execute({ id });

    return NextResponse.json(patient);
  }
);

export const PATCH = withAuthentication(
  ['update:patient'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const updateUseCase = makeUpdatePatientUseCase();

    const updated = await updateUseCase.execute({
      id,
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(updated);
  }
);

export const DELETE = withAuthentication(
  ['delete:patient'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const deleteUseCase = makeDeletePatientUseCase();
    await deleteUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
