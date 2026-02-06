import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
import { makeFindSessionsUseCase } from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/sessions
 * List all sessions with pagination and filters
 */
export const GET = withAuthentication(['read:session'], async (request) => {
  const searchParams = request.nextUrl.searchParams;
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const userId = searchParams.get('userId') || undefined;
  const timezoneOffset =
    request.headers.get('x-timezone-offset') ||
    searchParams.get('timezoneOffset') ||
    undefined;

  const useCase = makeFindSessionsUseCase();

  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    includeDeleted: searchParams.get('includeDeleted') === 'true',
    userId,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    timezoneOffset,
  });

  return NextResponse.json(result);
});

/**
 * DELETE /api/sessions/:id (via body or query for bulk, but here we'll use a specific ID if we had dynamic routes)
 * For simplicity in this file, we'll handle DELETE via body if needed,
 * but usually it's better in [id]/route.ts.
 * Let's just create the directory for it.
 */
