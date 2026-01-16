import { NextResponse } from 'next/server';

import {
  makeFindPermissionsUseCase,
  makeRegisterPermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { withAuthentication } from '@/lib/api-utils';

export const GET = withAuthentication(['read:permission'], async (request) => {
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
});

export const POST = withAuthentication(
  ['create:permission'],
  async (request, { auth }) => {
    const body = await request.json();
    const useCase = makeRegisterPermissionUseCase();

    const permission = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: auth.ipAddress,
      userAgent: auth.userAgent,
    });

    return NextResponse.json(permission, { status: 201 });
  }
);
