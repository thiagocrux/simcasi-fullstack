import { NextResponse } from 'next/server';

import { makeFindSessionsUseCase } from '@/core/infrastructure/factories/session.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/sessions
 * List all sessions with pagination and filters
 */
export const GET = withAuthentication(['read:session'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindSessionsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});

/**
 * DELETE /api/sessions/:id (via body or query for bulk, but here we'll use a specific ID if we had dynamic routes)
 * For simplicity in this file, we'll handle DELETE via body if needed,
 * but usually it's better in [id]/route.ts.
 * Let's just create the directory for it.
 */
