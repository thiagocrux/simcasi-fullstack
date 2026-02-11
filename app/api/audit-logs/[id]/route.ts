import { NextResponse } from 'next/server';

import { makeGetAuditLogByIdUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api.utils';

/**
 * [GET] /api/audit-logs/[id]
 * Retrieves a specific audit log record by its unique identifier.
 * @param request The incoming Next.js request.
 * @param context The request context containing route parameters.
 * @return A promise resolving to the audit log record.
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
