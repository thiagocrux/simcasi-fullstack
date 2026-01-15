import {
  makeFindUsersUseCase,
  makeRegisterUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['read:user']);

    const { searchParams } = new URL(request.url);
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const useCase = makeFindUsersUseCase();
    const result = await useCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      search: searchParams.get('search') || undefined,
      roleId: searchParams.get('roleId') || undefined,
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
    await authorize(auth.roleId, ['create:user']);

    const body = await request.json();
    const useCase = makeRegisterUserUseCase();
    const user = await useCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
