import { HealthCheckOutput } from '../../contracts/system/health-check.contract';
import { UseCase } from '../use-case.interface';

export interface IHealthCheckRepository {
  checkDatabase(): Promise<boolean>;
}

export class HealthCheckUseCase implements UseCase<void, HealthCheckOutput> {
  constructor(private readonly repository: IHealthCheckRepository) {}

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
