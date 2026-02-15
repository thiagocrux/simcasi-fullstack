import { NextResponse } from 'next/server';

import {
  makeFindExamsUseCase,
  makeRegisterExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/exams
 * Retrieves a paginated list of exam records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of exams and metadata.
 */
export const GET = withAuthentication(['read:exam'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindExamsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * [POST] /api/exams
 * Registers a new exam record in the system.
 * @param request The incoming Next.js request.
 * @param context The request context.
 * @return A promise resolving to the created exam record.
 */
export const POST = withAuthentication(['create:exam'], async (request) => {
  const body = await request.json();
  const registerUseCase = makeRegisterExamUseCase();
  const exam = await registerUseCase.execute({
    ...body,
  });

  return NextResponse.json(exam, { status: 201 });
});
