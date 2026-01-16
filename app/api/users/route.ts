import { NextResponse } from 'next/server';

import {
  makeFindUsersUseCase,
  makeRegisterUserUseCase,
} from '@/core/infrastructure/factories/user.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:user'], async (request) => {
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
});

export const POST = withAuthentication(
  ['create:user'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterUserUseCase();
    const user = await useCase.execute({
      ...body,
      userId: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(user, { status: 201 });
  }
);
