import { NextResponse } from 'next/server';

import {
  makeDeleteExamUseCase,
  makeGetExamByIdUseCase,
  makeUpdateExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:exam'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const getExamByIdUseCase = makeGetExamByIdUseCase();
    const exam = await getExamByIdUseCase.execute({ id });

    return NextResponse.json(exam);
  }
);

export const PATCH = withAuthentication(
  ['update:exam'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const updateUseCase = makeUpdateExamUseCase();

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
  ['delete:exam'],
  async (request, { params, auth }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const deleteUseCase = makeDeleteExamUseCase();
    await deleteUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return new NextResponse(null, { status: 204 });
  }
);
