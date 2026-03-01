jest.mock('../../lib/prisma', () => ({
  prisma: {
    treatment: {
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

import { treatmentMock } from '@/tests/mocks/repositories/treatment.mock';
import { prisma } from '../../lib/prisma';
import { PrismaTreatmentRepository } from './treatment.prisma.repository';

describe('PrismaTreatmentRepository', () => {
  let repository: PrismaTreatmentRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaTreatmentRepository();
  });

  it('should find a treatment by its unique ID', async () => {
    (prisma.treatment.findFirst as jest.Mock).mockResolvedValueOnce(
      treatmentMock
    );
    const result = await repository.findById(treatmentMock.id);
    expect(prisma.treatment.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: treatmentMock.id }),
      })
    );
    expect(result).toEqual(treatmentMock);
  });

  it('should retrieve all treatments with default params', async () => {
    (prisma.treatment.findMany as jest.Mock).mockResolvedValueOnce([
      treatmentMock,
    ]);
    (prisma.treatment.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.treatment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [treatmentMock], total: 1 });
  });

  it('should filter treatments by patientId', async () => {
    (prisma.treatment.findMany as jest.Mock).mockResolvedValueOnce([
      treatmentMock,
    ]);
    (prisma.treatment.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ patientId: treatmentMock.patientId });

    expect(prisma.treatment.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: treatmentMock.patientId,
        }),
      })
    );
  });

  it('should filter treatments by date range', async () => {
    (prisma.treatment.findMany as jest.Mock).mockResolvedValueOnce([
      treatmentMock,
    ]);
    (prisma.treatment.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.treatment.findMany).toHaveBeenCalledWith(
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

  it('should create a new treatment', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = treatmentMock;
    (prisma.treatment.create as jest.Mock).mockResolvedValueOnce(treatmentMock);

    const result = await repository.create(data);

    expect(prisma.treatment.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          patient: { connect: { id: data.patientId } },
        }),
      })
    );
    expect(result).toEqual(treatmentMock);
  });

  it('should update a treatment', async () => {
    const updated = { ...treatmentMock, observations: 'Updated' };
    (prisma.treatment.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      treatmentMock.id,
      { observations: 'Updated' },
      'user-id'
    );

    expect(prisma.treatment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: treatmentMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a treatment', async () => {
    (prisma.treatment.update as jest.Mock).mockResolvedValueOnce(treatmentMock);

    await repository.softDelete(treatmentMock.id, 'user-id');

    expect(prisma.treatment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: treatmentMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should soft delete all treatments by patientId', async () => {
    (prisma.treatment.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.softDeleteByPatientId(treatmentMock.patientId, 'user-id');

    expect(prisma.treatment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { patientId: treatmentMock.patientId, deletedAt: null },
      })
    );
  });

  it('should restore a soft deleted treatment', async () => {
    (prisma.treatment.update as jest.Mock).mockResolvedValueOnce(treatmentMock);

    await repository.restore(treatmentMock.id, 'user-id');

    expect(prisma.treatment.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: treatmentMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  it('should restore all treatments by patientId', async () => {
    (prisma.treatment.updateMany as jest.Mock).mockResolvedValueOnce({
      count: 1,
    });

    await repository.restoreByPatientId(treatmentMock.patientId, 'user-id');

    expect(prisma.treatment.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: treatmentMock.patientId,
        }),
      })
    );
  });
});
