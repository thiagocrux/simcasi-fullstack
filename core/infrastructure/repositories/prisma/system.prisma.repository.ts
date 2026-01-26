import { IHealthCheckRepository } from '@/core/application/use-cases/system/health-check.use-case';
import { prisma } from '../../lib/prisma';

/**
 * Concrete implementation of the HealthCheck repository using Prisma.
 */
export class PrismaHealthCheckRepository implements IHealthCheckRepository {
  async checkDatabase(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch {
      return false;
    }
  }
}
