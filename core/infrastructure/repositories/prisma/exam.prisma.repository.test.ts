jest.mock('../../lib/prisma', () => ({
  prisma: {
    exam: {
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

import { examMock } from '@/tests/mocks/repositories/exam.mock';
import { prisma } from '../../lib/prisma';
import { PrismaExamRepository } from './exam.prisma.repository';

describe('PrismaExamRepository', () => {
  let repository: PrismaExamRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaExamRepository();
  });

  it('should find an exam by its unique ID', async () => {
    (prisma.exam.findFirst as jest.Mock).mockResolvedValueOnce(examMock);
    const result = await repository.findById(examMock.id);
    expect(prisma.exam.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: examMock.id }),
      })
    );
    expect(result).toEqual(examMock);
  });

  it('should retrieve all exams with default params', async () => {
    (prisma.exam.findMany as jest.Mock).mockResolvedValueOnce([examMock]);
    (prisma.exam.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [examMock], total: 1 });
  });

  it('should filter exams by patientId', async () => {
    (prisma.exam.findMany as jest.Mock).mockResolvedValueOnce([examMock]);
    (prisma.exam.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ patientId: examMock.patientId });

    expect(prisma.exam.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: examMock.patientId,
        }),
      })
    );
  });

  it('should filter exams by date range', async () => {
    (prisma.exam.findMany as jest.Mock).mockResolvedValueOnce([examMock]);
    (prisma.exam.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.exam.findMany).toHaveBeenCalledWith(
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

  it('should create a new exam', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = examMock;
    (prisma.exam.create as jest.Mock).mockResolvedValueOnce(examMock);

    const result = await repository.create(data);

    expect(prisma.exam.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          patient: { connect: { id: data.patientId } },
        }),
      })
    );
    expect(result).toEqual(examMock);
  });

  it('should update an exam', async () => {
    const updatedExam = { ...examMock, referenceObservations: 'Updated' };
    (prisma.exam.update as jest.Mock).mockResolvedValueOnce(updatedExam);

    const result = await repository.update(
      examMock.id,
      { referenceObservations: 'Updated' },
      'user-id'
    );

    expect(prisma.exam.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: examMock.id },
        data: expect.objectContaining({
          referenceObservations: 'Updated',
        }),
      })
    );
    expect(result).toEqual(updatedExam);
  });

  it('should soft delete an exam', async () => {
    (prisma.exam.update as jest.Mock).mockResolvedValueOnce(examMock);

    await repository.softDelete(examMock.id, 'user-id');

    expect(prisma.exam.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: examMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should soft delete all exams by patientId', async () => {
    (prisma.exam.updateMany as jest.Mock).mockResolvedValueOnce({ count: 1 });

    await repository.softDeleteByPatientId(examMock.patientId, 'user-id');

    expect(prisma.exam.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { patientId: examMock.patientId, deletedAt: null },
      })
    );
  });

  it('should restore a soft deleted exam', async () => {
    (prisma.exam.update as jest.Mock).mockResolvedValueOnce(examMock);

    await repository.restore(examMock.id, 'user-id');

    expect(prisma.exam.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: examMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });

  it('should restore all exams by patientId', async () => {
    (prisma.exam.updateMany as jest.Mock).mockResolvedValueOnce({ count: 1 });

    await repository.restoreByPatientId(examMock.patientId, 'user-id');

    expect(prisma.exam.updateMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          patientId: examMock.patientId,
        }),
      })
    );
  });
});
