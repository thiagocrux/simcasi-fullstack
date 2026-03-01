jest.mock('../../lib/prisma', () => ({
  prisma: {
    session: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      deleteMany: jest.fn(),
    },
  },
}));

import { sessionMock } from '@/tests/mocks/repositories/session.mock';
import { prisma } from '../../lib/prisma';
import { PrismaSessionRepository } from './session.prisma.repository';

describe('PrismaSessionRepository', () => {
  let repository: PrismaSessionRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaSessionRepository();
  });

  it('should find a session by its unique ID', async () => {
    (prisma.session.findFirst as jest.Mock).mockResolvedValueOnce(sessionMock);
    const result = await repository.findById(sessionMock.id);
    expect(prisma.session.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: sessionMock.id }),
      })
    );
    expect(result).toEqual(sessionMock);
  });

  it('should retrieve all sessions with default params', async () => {
    (prisma.session.findMany as jest.Mock).mockResolvedValueOnce([sessionMock]);
    (prisma.session.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.session.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [sessionMock], total: 1 });
  });

  it('should filter sessions by userId', async () => {
    (prisma.session.findMany as jest.Mock).mockResolvedValueOnce([sessionMock]);
    (prisma.session.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ userId: sessionMock.userId });

    expect(prisma.session.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: sessionMock.userId,
        }),
      })
    );
  });

  it('should create a new session', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = sessionMock;
    (prisma.session.create as jest.Mock).mockResolvedValueOnce(sessionMock);

    const result = await repository.create(data);

    expect(prisma.session.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          userId: data.userId,
        }),
      })
    );
    expect(result).toEqual(sessionMock);
  });

  it('should update a session', async () => {
    const updated = { ...sessionMock, userAgent: 'Updated' };
    (prisma.session.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(sessionMock.id, {
      userAgent: 'Updated',
    });

    expect(prisma.session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: sessionMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a session (revoke)', async () => {
    (prisma.session.update as jest.Mock).mockResolvedValueOnce(sessionMock);

    await repository.softDelete(sessionMock.id);

    expect(prisma.session.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: sessionMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should revoke all sessions for a user', async () => {
    (prisma.session.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 2,
    });

    await repository.revokeAllByUserId(sessionMock.userId);

    expect(prisma.session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: sessionMock.userId,
          deletedAt: null,
        }),
      })
    );
  });

  it('should revoke other sessions for a user', async () => {
    (prisma.session.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.revokeOtherSessions(sessionMock.id, sessionMock.userId);

    expect(prisma.session.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: sessionMock.userId,
          id: { not: sessionMock.id },
        }),
      })
    );
  });

  it('should delete expired sessions', async () => {
    (prisma.session.deleteMany as jest.Mock).mockResolvedValueOnce({
      count: 5,
    });

    const result = await repository.deleteExpired();

    expect(prisma.session.deleteMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          expiresAt: expect.objectContaining({
            lt: expect.any(Date),
          }),
        }),
      })
    );
    expect(result).toEqual(5);
  });
});
