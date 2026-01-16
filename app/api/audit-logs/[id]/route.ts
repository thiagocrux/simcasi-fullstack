import { NextResponse } from 'next/server';

import { makeGetAuditLogByIdUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/audit-logs/[id]
 * Get audit log details by ID
 */
export const GET = withAuthentication(
  ['read:audit-log'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeGetAuditLogByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);
