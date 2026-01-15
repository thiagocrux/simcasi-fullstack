import {
  makeFindPatientsUseCase,
  makeRegisterPatientUseCase,
} from '@/core/infrastructure/factories/patient.factory';
import { authenticateRequest } from '@/core/infrastructure/middleware/authentication.middleware';
import { authorize } from '@/core/infrastructure/middleware/authorization.middleware';
import { handleApiError } from '@/lib/apiErrorHandler';
import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/patients
 * List patients (Requires view permission)
 */
export async function GET(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['view:patient']);

    const searchParams = request.nextUrl.searchParams;
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || undefined;

    const findPatientsUseCase = makeFindPatientsUseCase();
    const result = await findPatientsUseCase.execute({
      skip: (page - 1) * limit,
      take: limit,
      search,
      includeDeleted: searchParams.get('includeDeleted') === 'true',
    });

    return NextResponse.json(result);
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * POST /api/patients
 * Register a new patient (Requires create permission + Audit)
 */
export async function POST(request: NextRequest) {
  try {
    const auth = await authenticateRequest(request);
    await authorize(auth.roleId, ['create:patient']);

    const body = await request.json();
    const registerUseCase = makeRegisterPatientUseCase();

    const patient = await registerUseCase.execute({
      ...body,
      createdBy: auth.userId,
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(patient, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
