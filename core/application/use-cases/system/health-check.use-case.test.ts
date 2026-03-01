import { HealthCheckUseCase } from './health-check.use-case';

const mockRepository = {
  checkDatabase: jest.fn(),
};

describe('HealthCheckUseCase', () => {
  let useCase: HealthCheckUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new HealthCheckUseCase(mockRepository);
  });

  it('should return UP status when database is healthy', async () => {
    mockRepository.checkDatabase.mockResolvedValueOnce(true);

    const result = await useCase.execute();

    expect(result.status).toBe('UP');
    expect(result.database).toBe('UP');
    expect(typeof result.uptime).toBe('number');
    expect(result.timestamp).toBeDefined();
    expect(result.latency).toMatch(/^\d+ms$/);
  });

  it('should return DOWN status when database is unhealthy', async () => {
    mockRepository.checkDatabase.mockResolvedValueOnce(false);

    const result = await useCase.execute();

    expect(result.status).toBe('DOWN');
    expect(result.database).toBe('DOWN');
  });
});
