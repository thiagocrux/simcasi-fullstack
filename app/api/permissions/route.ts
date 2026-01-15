import {
  makeFindPermissionsUseCase,
  makeRegisterPermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['view:permission']);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 100;
    const useCase = makeFindPermissionsUseCase();
    const result = await useCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      search: searchParams.get('search') || undefined,
      includeDeleted: searchParams.get('includeDeleted') === 'true',
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['create:permission']);

    const body = await request.json();
    const useCase = makeRegisterPermissionUseCase();
    const permission = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(permission, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
