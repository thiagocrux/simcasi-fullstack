jest.mock('../../lib/prisma', () => ({
  prisma: {
    auditLog: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { auditLogMock } from '@/tests/mocks/repositories/audit-log.mock';
import { prisma } from '../../lib/prisma';
import { PrismaAuditLogRepository } from './audit-log.prisma.repository';

describe('PrismaAuditLogRepository', () => {
  let repository: PrismaAuditLogRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaAuditLogRepository();
  });

  it('should find an audit log by its unique ID', async () => {
    (prisma.auditLog.findUnique as jest.Mock).mockResolvedValueOnce(
      auditLogMock
    );
    const result = await repository.findById('1');
    expect(prisma.auditLog.findUnique).toHaveBeenCalledWith({
      where: { id: '1' },
    });
    expect(result).toEqual(auditLogMock);
  });

  it('should retrieve all audit logs with default params', async () => {
    (prisma.auditLog.findMany as jest.Mock).mockResolvedValueOnce([
      auditLogMock,
    ]);
    (prisma.auditLog.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith({
      where: {
        action: undefined,
        entityId: undefined,
        entityName: undefined,
        userId: undefined,
      },
      skip: 0,
      take: 20,
      orderBy: [{ createdAt: 'desc' }],
    });
    expect(prisma.auditLog.count).toHaveBeenCalledWith({
      where: {
        action: undefined,
        entityId: undefined,
        entityName: undefined,
        userId: undefined,
      },
    });
    expect(result).toEqual({ items: [auditLogMock], total: 1 });
  });

  it('should create a new audit log', async () => {
    const { id, createdAt, ...data } = auditLogMock;
    (prisma.auditLog.create as jest.Mock).mockResolvedValueOnce(auditLogMock);

    const result = await repository.create(data);

    expect(prisma.auditLog.create).toHaveBeenCalledWith({
      data: {
        ...data,
        oldValues: data.oldValues,
        newValues: data.newValues,
      },
    });
    expect(result).toEqual(auditLogMock);
  });

  it('should filter audit logs by date range', async () => {
    (prisma.auditLog.findMany as jest.Mock).mockResolvedValueOnce([
      auditLogMock,
    ]);
    (prisma.auditLog.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      })
    );
    expect(result).toEqual({ items: [auditLogMock], total: 1 });
  });

  it('should filter audit logs by search term and field', async () => {
    (prisma.auditLog.findMany as jest.Mock).mockResolvedValueOnce([
      auditLogMock,
    ]);
    (prisma.auditLog.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      search: 'John',
      searchBy: 'entityName',
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          entityName: expect.objectContaining({ contains: 'John' }),
        }),
      })
    );
  });

  it('should filter audit logs by action and userId', async () => {
    (prisma.auditLog.findMany as jest.Mock).mockResolvedValueOnce([
      auditLogMock,
    ]);
    (prisma.auditLog.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      action: 'CREATE',
      userId: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
    });

    expect(prisma.auditLog.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          action: 'CREATE',
          userId: '12aa95d3-1024-47fd-8be1-1ff6c129c14d',
        }),
      })
    );
  });
});
