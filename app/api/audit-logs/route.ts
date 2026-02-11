import { NextResponse } from 'next/server';

import { makeFindAuditLogsUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/audit-logs
 * Retrieves a paginated list of audit log records with optional filtering.
 * @param request The incoming Next.js request.
 * @return A promise resolving to the list of audit logs and metadata.
 */
export const GET = withAuthentication(['read:audit-log'], async (request) => {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const useCase = makeFindAuditLogsUseCase();
  const result = await useCase.execute(searchParams);

  return NextResponse.json(result);
});
