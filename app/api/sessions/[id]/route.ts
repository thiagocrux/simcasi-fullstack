import { makeRevokeSessionUseCase } from '@/core/infrastructure/factories/session.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

/**
 * DELETE /api/sessions/:id
 * Revokes a specific session (Admin only)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['delete:session']);

    const revokeUseCase = makeRevokeSessionUseCase();
    await revokeUseCase.execute({
      id,
      userId: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return handleApiError(error);
  }
}
