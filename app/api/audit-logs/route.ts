import { NextResponse } from 'next/server';

import { makeFindAuditLogsUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:audit-log'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 20;

  const useCase = makeFindAuditLogsUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search: searchParams.get('search') || undefined,
    userId: searchParams.get('userId') || undefined,
    action: searchParams.get('action') || undefined,
    entityName: searchParams.get('entityName') || undefined,
    entityId: searchParams.get('entityId') || undefined,
  });

  return NextResponse.json(result);
});
