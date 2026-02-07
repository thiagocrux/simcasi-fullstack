import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
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
  const { searchParams } = request.nextUrl;
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const timezoneOffset =
    request.headers.get('x-timezone-offset') ||
    searchParams.get('timezoneOffset') ||
    undefined;

  const useCase = makeFindExamsUseCase();

  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    search: searchParams.get('search') || undefined,
    searchBy: searchParams.get('searchBy') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    timezoneOffset,
    patientId: searchParams.get('patientId') || undefined,
    includeRelatedUsers: searchParams.get('includeRelatedUsers') === 'true',
    includeRelatedPatients:
      searchParams.get('includeRelatedPatients') === 'true',
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

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
