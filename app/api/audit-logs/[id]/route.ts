import { makeGetAuditLogByIdUseCase } from '@/core/infrastructure/factories/audit-log.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['view:audit_log']);

    const useCase = makeGetAuditLogByIdUseCase();
    const result = await useCase.execute({ id });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}
