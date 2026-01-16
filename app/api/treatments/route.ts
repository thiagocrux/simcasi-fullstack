import { NextResponse } from 'next/server';

import {
  makeFindTreatmentsUseCase,
  makeRegisterTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:treatment'], async (request) => {
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;
  const search = searchParams.get('search') || undefined;
  const patientId = searchParams.get('patientId') || undefined;

  const useCase = makeFindTreatmentsUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search,
    patientId,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

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
