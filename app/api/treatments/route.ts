import {
  makeFindTreatmentsUseCase,
  makeRegisterTreatmentUseCase,
} from '@/core/infrastructure/factories/treatment.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['read:treatment']);

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;
    const patientId = searchParams.get('patientId') || undefined;

    const useCase = makeFindTreatmentsUseCase();
    const result = await useCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      search,
      patientId,
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
    await authorize(auth.roleId, ['create:treatment']);

    const body = await request.json();
    const useCase = makeRegisterTreatmentUseCase();

    const treatment = await useCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(treatment, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
