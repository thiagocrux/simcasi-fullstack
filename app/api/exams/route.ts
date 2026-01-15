import {
  makeFindExamsUseCase,
  makeRegisterExamUseCase,
} from '@/core/infrastructure/factories/exam.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['view:exam']);

    const { searchParams } = request.nextUrl;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;
    const patientId = searchParams.get('patientId') || undefined;

    const findExamsUseCase = makeFindExamsUseCase();
    const result = await findExamsUseCase.execute({
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
    await authorize(auth.roleId, ['create:exam']);

    const body = await request.json();
    const registerUseCase = makeRegisterExamUseCase();

    const exam = await registerUseCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(exam, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
