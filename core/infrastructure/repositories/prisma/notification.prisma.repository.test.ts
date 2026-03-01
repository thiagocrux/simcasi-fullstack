jest.mock('../../lib/prisma', () => ({
  prisma: {
    notification: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { notificationMock } from '@/tests/mocks/repositories/notification.mock';
import { prisma } from '../../lib/prisma';
import { PrismaNotificationRepository } from './notification.prisma.repository';

describe('PrismaNotificationRepository', () => {
  let repository: PrismaNotificationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaNotificationRepository();
  });

  it('should find a notification by its unique ID', async () => {
    (prisma.notification.findFirst as jest.Mock).mockResolvedValueOnce(
      notificationMock
    );
    const result = await repository.findById(notificationMock.id);
    expect(prisma.notification.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: notificationMock.id }),
      })
    );
    expect(result).toEqual(notificationMock);
  });

  it('should retrieve all notifications with default params', async () => {
    (prisma.notification.findMany as jest.Mock).mockResolvedValueOnce([
      notificationMock,
    ]);
    (prisma.notification.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [notificationMock], total: 1 });
  });

  it('should filter notifications by patientId', async () => {
    (prisma.notification.findMany as jest.Mock).mockResolvedValueOnce([
      notificationMock,
    ]);
    (prisma.notification.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ patientId: notificationMock.patientId });

    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: notificationMock.patientId,
        }),
      })
    );
  });

  it('should filter notifications by date range', async () => {
    (prisma.notification.findMany as jest.Mock).mockResolvedValueOnce([
      notificationMock,
    ]);
    (prisma.notification.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.notification.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          createdAt: expect.objectContaining({
            gte: expect.any(Date),
            lte: expect.any(Date),
          }),
        }),
      })
    );
  });

  it('should create a new notification', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = notificationMock;
    (prisma.notification.create as jest.Mock).mockResolvedValueOnce(
      notificationMock
    );

    const result = await repository.create(data);

    expect(prisma.notification.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          patient: { connect: { id: data.patientId } },
        }),
      })
    );
    expect(result).toEqual(notificationMock);
  });

  it('should update a notification', async () => {
    const updated = { ...notificationMock, observations: 'Updated' };
    (prisma.notification.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      notificationMock.id,
      { observations: 'Updated' },
      'user-id'
    );

    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: notificationMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a notification', async () => {
    (prisma.notification.update as jest.Mock).mockResolvedValueOnce(
      notificationMock
    );

    await repository.softDelete(notificationMock.id, 'user-id');

    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: notificationMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should soft delete all notifications by patientId', async () => {
    (prisma.notification.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.softDeleteByPatientId(
      notificationMock.patientId,
      'user-id'
    );

    expect(prisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { patientId: notificationMock.patientId, deletedAt: null },
      })
    );
  });

  it('should restore a soft deleted notification', async () => {
    (prisma.notification.update as jest.Mock).mockResolvedValueOnce(
      notificationMock
    );

    await repository.restore(notificationMock.id, 'user-id');

    expect(prisma.notification.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: notificationMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  it('should restore all notifications by patientId', async () => {
    (prisma.notification.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.restoreByPatientId(notificationMock.patientId, 'user-id');

    expect(prisma.notification.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: notificationMock.patientId,
        }),
      })
    );
  });
});
