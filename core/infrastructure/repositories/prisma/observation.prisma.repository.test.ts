jest.mock('../../lib/prisma', () => ({
  prisma: {
    observation: {
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

import { observationMock } from '@/tests/mocks/repositories/observation.mock';
import { prisma } from '../../lib/prisma';
import { PrismaObservationRepository } from './observation.prisma.repository';

describe('PrismaObservationRepository', () => {
  let repository: PrismaObservationRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaObservationRepository();
  });

  it('should find an observation by its unique ID', async () => {
    (prisma.observation.findFirst as jest.Mock).mockResolvedValueOnce(
      observationMock
    );
    const result = await repository.findById(observationMock.id);
    expect(prisma.observation.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: observationMock.id }),
      })
    );
    expect(result).toEqual(observationMock);
  });

  it('should retrieve all observations with default params', async () => {
    (prisma.observation.findMany as jest.Mock).mockResolvedValueOnce([
      observationMock,
    ]);
    (prisma.observation.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.observation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [observationMock], total: 1 });
  });

  it('should filter observations by patientId', async () => {
    (prisma.observation.findMany as jest.Mock).mockResolvedValueOnce([
      observationMock,
    ]);
    (prisma.observation.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ patientId: observationMock.patientId });

    expect(prisma.observation.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: observationMock.patientId,
        }),
      })
    );
  });

  it('should filter observations by date range', async () => {
    (prisma.observation.findMany as jest.Mock).mockResolvedValueOnce([
      observationMock,
    ]);
    (prisma.observation.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.observation.findMany).toHaveBeenCalledWith(
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

  it('should create a new observation', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = observationMock;
    (prisma.observation.create as jest.Mock).mockResolvedValueOnce(
      observationMock
    );

    const result = await repository.create(data);

    expect(prisma.observation.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          patient: { connect: { id: data.patientId } },
        }),
      })
    );
    expect(result).toEqual(observationMock);
  });

  it('should update an observation', async () => {
    const updated = { ...observationMock, observations: 'Updated' };
    (prisma.observation.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      observationMock.id,
      { observations: 'Updated' },
      'user-id'
    );

    expect(prisma.observation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: observationMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete an observation', async () => {
    (prisma.observation.update as jest.Mock).mockResolvedValueOnce(
      observationMock
    );

    await repository.softDelete(observationMock.id, 'user-id');

    expect(prisma.observation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: observationMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should soft delete all observations by patientId', async () => {
    (prisma.observation.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.softDeleteByPatientId(
      observationMock.patientId,
      'user-id'
    );

    expect(prisma.observation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { patientId: observationMock.patientId, deletedAt: null },
      })
    );
  });

  it('should restore a soft deleted observation', async () => {
    (prisma.observation.update as jest.Mock).mockResolvedValueOnce(
      observationMock
    );

    await repository.restore(observationMock.id, 'user-id');

    expect(prisma.observation.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: observationMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  it('should restore all observations by patientId', async () => {
    (prisma.observation.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.restoreByPatientId(observationMock.patientId, 'user-id');

    expect(prisma.observation.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: observationMock.patientId,
        }),
      })
    );
  });
});
