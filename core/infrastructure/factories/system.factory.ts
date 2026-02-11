import { HealthCheckUseCase } from '@/core/application/use-cases/system/health-check.use-case';
import { PrismaHealthCheckRepository } from '../repositories/prisma/system.prisma.repository';

/**
 * Factory for HealthCheckUseCase.
 * @returns A fully initialized HealthCheckUseCase.
 */
export function makeHealthCheckUseCase() {
  const repository = new PrismaHealthCheckRepository();
  return new HealthCheckUseCase(repository);
}
