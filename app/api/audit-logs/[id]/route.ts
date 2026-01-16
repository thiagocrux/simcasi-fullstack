import { NextResponse } from 'next/server';

import { makeGetAuditLogByIdUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(
  ['read:audit-log'],
  async (request, { params }) => {
    const { id } = await (params as Promise<{ id: string }>);

    const useCase = makeGetAuditLogByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  }
);
