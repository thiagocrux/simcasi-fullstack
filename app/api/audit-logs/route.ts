import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
import { makeFindAuditLogsUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/audit-logs
 * List all audit logs with pagination and filters
 */
export const GET = withAuthentication(['read:audit-log'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );
  const timezoneOffset =
    request.headers.get('x-timezone-offset') ||
    searchParams.get('timezoneOffset') ||
    undefined;

  const useCase = makeFindAuditLogsUseCase();

  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    search: searchParams.get('search') || undefined,
    userId: searchParams.get('userId') || undefined,
    action: searchParams.get('action') || undefined,
    entityName: searchParams.get('entityName') || undefined,
    entityId: searchParams.get('entityId') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
    timezoneOffset,
  });

  return NextResponse.json(result);
});
