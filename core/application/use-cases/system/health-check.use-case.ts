import { HealthCheckOutput } from '../../contracts/system/health-check.contract';
import { UseCase } from '../use-case.interface';

export interface IHealthCheckRepository {
  checkDatabase(): Promise<boolean>;
}

/**
 * Use case to perform a system health check.
 */
export class HealthCheckUseCase implements UseCase<void, HealthCheckOutput> {
  /**
   * Creates an instance of HealthCheckUseCase.
   * @param repository The repository to check the database status.
   */
  constructor(private readonly repository: IHealthCheckRepository) {}

  /**
   * Executes the use case to check system health.
   * @return A promise that resolves to the health check status.
   */
  async execute(): Promise<HealthCheckOutput> {
    const startTime = Date.now();
    const isDatabaseUp = await this.repository.checkDatabase();

    return {
      status: isDatabaseUp ? 'UP' : 'DOWN',
      database: isDatabaseUp ? 'UP' : 'DOWN',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      latency: `${Date.now() - startTime}ms`,
    };
  }
}
