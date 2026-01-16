import { NextResponse } from 'next/server';

import {
  makeFindRolesUseCase,
  makeRegisterRoleUseCase,
} from '@/core/infrastructure/factories/role.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:role'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 10;

  const useCase = makeFindRolesUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    search: searchParams.get('search') || undefined,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
  });

  return NextResponse.json(result);
});

export const POST = withAuthentication(
  ['create:role'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterRoleUseCase();

    const role = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(role, { status: 201 });
  }
);
