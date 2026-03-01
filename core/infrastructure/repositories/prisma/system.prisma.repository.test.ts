jest.mock('../../lib/prisma', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

import { prisma } from '../../lib/prisma';
import { PrismaHealthCheckRepository } from './system.prisma.repository';

describe('PrismaHealthCheckRepository', () => {
  let repository: PrismaHealthCheckRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaHealthCheckRepository();
  });

  it('should return true when database is available', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValueOnce([{ 1: 1 }]);

    const result = await repository.checkDatabase();

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  it('should return false when database fails', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValueOnce(
      new Error('Connection failed')
    );

    const result = await repository.checkDatabase();

    expect(prisma.$queryRaw).toHaveBeenCalled();
    expect(result).toBe(false);
  });
});
