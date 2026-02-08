import { NextResponse } from 'next/server';

import {
  makeFindExamsUseCase,
  makeRegisterExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/exams
 * List all exams with pagination and filters
 */
export const GET = withAuthentication(['read:exam'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindExamsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * POST - /api/exams
 * Register a new exam
 */
export const POST = withAuthentication(
  ['create:exam'],
  async (request, { auth }) => {
    const body = await request.json();
    const registerUseCase = makeRegisterExamUseCase();

    const exam = await registerUseCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(exam, { status: 201 });
  }
);
