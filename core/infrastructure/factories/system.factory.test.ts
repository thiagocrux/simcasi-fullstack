import { HealthCheckUseCase } from '@/core/application/use-cases/system/health-check.use-case';
import { makeHealthCheckUseCase } from './system.factory';

describe('system.factory', () => {
  describe('makeHealthCheckUseCase', () => {
    it('should return an instance of HealthCheckUseCase', () => {
      const useCase = makeHealthCheckUseCase();
      expect(useCase).toBeInstanceOf(HealthCheckUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeHealthCheckUseCase();
      expect(useCase.execute).toBeDefined();
      expect(typeof useCase.execute).toBe('function');
    });
  });
});
