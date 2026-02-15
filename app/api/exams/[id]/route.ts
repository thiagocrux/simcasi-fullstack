import { NextResponse } from 'next/server';

import {
  makeDeleteExamUseCase,
  makeGetExamByIdUseCase,
  makeUpdateExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/exams/[id]
 * Retrieves a single exam record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the exam data.
 */
export const GET = withAuthentication(
  ['read:exam'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const getExamByIdUseCase = makeGetExamByIdUseCase();
    const exam = await getExamByIdUseCase.execute({ id });

    return NextResponse.json(exam);
  }
);

/**
 * [PATCH] /api/exams/[id]
 * Updates an existing exam record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A promise resolving to the updated exam record.
 */
export const PATCH = withAuthentication(
  ['update:exam'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const body = await request.json();
    const updateUseCase = makeUpdateExamUseCase();
    const updated = await updateUseCase.execute({
      id,
      ...body,
    });

    return NextResponse.json(updated);
  }
);

/**
 * [DELETE] /api/exams/[id]
 * Performs a soft delete on an exam record.
 * @param request The incoming Next.js request.
 * @param context The request context containing the route parameters.
 * @return A response confirming deletion (204 No Content).
 */
export const DELETE = withAuthentication(
  ['delete:exam'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);
    const deleteUseCase = makeDeleteExamUseCase();
    await deleteUseCase.execute({
      id,
    });

    return new NextResponse(null, { status: 204 });
  }
);
