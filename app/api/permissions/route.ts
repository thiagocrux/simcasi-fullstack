import { NextResponse } from 'next/server';

import { PAGINATION } from '@/core/domain/constants/pagination.constants';
import {
  makeFindPermissionsUseCase,
  makeRegisterPermissionUseCase,
} from '@/core/infrastructure/factories/permission.factory';
import { parseDateFilters, withAuthentication } from '@/lib/api.utils';

/**
 * GET - /api/permissions
 * List all permissions with pagination and filters
 */
export const GET = withAuthentication(['read:permission'], async (request) => {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || PAGINATION.DEFAULT_PAGE;
  const limit = Math.min(
    Number(searchParams.get('limit')) || PAGINATION.DEFAULT_LIMIT,
    PAGINATION.MAX_LIMIT
  );

  const useCase = makeFindPermissionsUseCase();
  const result = await useCase.execute({
    skip: (page - 1) * limit,
    take: limit,
    orderBy: searchParams.get('orderBy') || undefined,
    orderDir: (searchParams.get('orderDir') as 'asc' | 'desc') || 'desc',
    search: searchParams.get('search') || undefined,
    searchBy: searchParams.get('searchBy') || undefined,
    includeDeleted: searchParams.get('includeDeleted') === 'true',
    ...parseDateFilters(searchParams),
  });

  return NextResponse.json(result);
});

/**
 * POST - /api/permissions
 * Register a new permission
 */
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
