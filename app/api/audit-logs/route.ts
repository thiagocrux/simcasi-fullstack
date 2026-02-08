import { NextResponse } from 'next/server';

import { makeFindAuditLogsUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/audit-logs
 * List all audit logs with pagination and filters
 */
export const GET = withAuthentication(['read:audit-log'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindAuditLogsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});
