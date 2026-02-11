import { makeHealthCheckUseCase } from '@/core/infrastructure/factories/system.factory';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

/**
 * [GET] /api/health
 * Retrieves the operational status of the API and its dependencies.
 * @return A promise resolving to the health check result.
 */
export async function GET() {
  const useCase = makeHealthCheckUseCase();
  const result = await useCase.execute();

  return NextResponse.json(result, {
    status: result.status === 'UP' ? 200 : 503,
  });
}
