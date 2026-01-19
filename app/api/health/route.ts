import { makeHealthCheckUseCase } from '@/core/infrastructure/factories/system.factory';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * GET - /api/health
 * Returns the operational status of the API and its dependencies.
 */
export async function GET() {
  const useCase = makeHealthCheckUseCase();
  const result = await useCase.execute();

  return NextResponse.json(result, {
    status: result.status === 'UP' ? 200 : 503,
  });
}
