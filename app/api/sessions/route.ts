import { makeFindSessionsUseCase } from '@/core/infrastructure/factories/session.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/sessions
 * List all sessions (Admin only)
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['view:sessions']);

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const userId = searchParams.get('userId') || undefined;

    const findSessionsUseCase = makeFindSessionsUseCase();
    const result = await findSessionsUseCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      userId,
      includeDeleted: searchParams.get('includeDeleted') === 'true',
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/sessions/:id (via body or query for bulk, but here we'll use a specific ID if we had dynamic routes)
 * For simplicity in this file, we'll handle DELETE via body if needed,
 * but usually it's better in [id]/route.ts.
 * Let's just create the directory for it.
 */
