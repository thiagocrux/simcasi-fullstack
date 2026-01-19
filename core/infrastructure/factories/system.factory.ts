import {
  HealthCheckUseCase,
  IHealthCheckRepository,
} from '@/core/application/use-cases/system/health-check.use-case';
import { prisma } from '../lib/prisma';

/**
 * Repository implementation for Health Check
 */
class HealthCheckRepository implements IHealthCheckRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}

/**
 * Factory for HealthCheckUseCase
 */
export function makeHealthCheckUseCase() {
  const repository = new HealthCheckRepository();
  return new HealthCheckUseCase(repository);
}
