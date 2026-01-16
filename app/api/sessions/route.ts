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

  const findSessionsUseCase = makeFindSessionsUseCase();
  const result = await findSessionsUseCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    userId,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

/**
 * DELETE /api/sessions/:id (via body or query for bulk, but here we'll use a specific ID if we had dynamic routes)
 * For simplicity in this file, we'll handle DELETE via body if needed,
 * but usually it's better in [id]/route.ts.
 * Let's just create the directory for it.
 */
