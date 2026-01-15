import { makeRestoreExamUseCase } from '@/core/infrastructure/factories/exam.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['restore:exam']);

    const restoreUseCase = makeRestoreExamUseCase();
    const restored = await restoreUseCase.execute({
      id: params.id,
      updatedBy: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(restored);
  } catch (error) {
    return handleApiError(error);
  }
}
