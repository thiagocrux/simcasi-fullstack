jest.mock('../../lib/prisma', () => ({
  prisma: {
    patient: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

import { patientMock } from '@/tests/mocks/repositories/patient.mock';
import { prisma } from '../../lib/prisma';
import { PrismaPatientRepository } from './patient.prisma.repository';

describe('PrismaPatientRepository', () => {
  let repository: PrismaPatientRepository;

  beforeEach(() => {
    jest.clearAllMocks();
    repository = new PrismaPatientRepository();
  });

  it('should find a patient by its unique ID', async () => {
    (prisma.patient.findFirst as jest.Mock).mockResolvedValueOnce(patientMock);
    const result = await repository.findById(patientMock.id);
    expect(prisma.patient.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: patientMock.id }),
      })
    );
    expect(result).toEqual(patientMock);
  });

  it('should find patients by multiple IDs', async () => {
    (prisma.patient.findMany as jest.Mock).mockResolvedValueOnce([patientMock]);
    const result = await repository.findByIds([patientMock.id]);
    expect(prisma.patient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: { in: [patientMock.id] } },
      })
    );
    expect(result).toEqual([patientMock]);
  });

  it('should find a patient by CPF', async () => {
    (prisma.patient.findFirst as jest.Mock).mockResolvedValueOnce(patientMock);
    const result = await repository.findByCpf(patientMock.cpf!);
    expect(prisma.patient.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          cpf: patientMock.cpf,
        }),
      })
    );
    expect(result).toEqual(patientMock);
  });

  it('should find a patient by SUS card number', async () => {
    (prisma.patient.findFirst as jest.Mock).mockResolvedValueOnce(patientMock);
    const result = await repository.findBySusCardNumber(
      patientMock.susCardNumber!
    );
    expect(prisma.patient.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          susCardNumber: patientMock.susCardNumber,
        }),
      })
    );
    expect(result).toEqual(patientMock);
  });

  it('should retrieve all patients with default params', async () => {
    (prisma.patient.findMany as jest.Mock).mockResolvedValueOnce([patientMock]);
    (prisma.patient.count as jest.Mock).mockResolvedValueOnce(1);

    const result = await repository.findAll();

    expect(prisma.patient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        skip: 0,
        take: 20,
      })
    );
    expect(result).toEqual({ items: [patientMock], total: 1 });
  });

  it('should filter patients by search term', async () => {
    (prisma.patient.findMany as jest.Mock).mockResolvedValueOnce([patientMock]);
    (prisma.patient.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({ search: 'Maria' });

    expect(prisma.patient.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          OR: expect.any(Array),
        }),
      })
    );
  });

  it('should filter patients by date range', async () => {
    (prisma.patient.findMany as jest.Mock).mockResolvedValueOnce([patientMock]);
    (prisma.patient.count as jest.Mock).mockResolvedValueOnce(1);

    await repository.findAll({
      startDate: '2026-01-01',
      endDate: '2026-01-31',
    });

    expect(prisma.patient.findMany).toHaveBeenCalledWith(
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

  it('should create a new patient', async () => {
    const { id, createdAt, updatedAt, deletedAt, ...data } = patientMock;
    (prisma.patient.create as jest.Mock).mockResolvedValueOnce(patientMock);

    const result = await repository.create(data);

    expect(prisma.patient.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          cpf: data.cpf,
          name: data.name,
        }),
      })
    );
    expect(result).toEqual(patientMock);
  });

  it('should update a patient', async () => {
    const updated = { ...patientMock, name: 'Maria Santos' };
    (prisma.patient.update as jest.Mock).mockResolvedValueOnce(updated);

    const result = await repository.update(
      patientMock.id,
      { name: 'Maria Santos' },
      'user-id'
    );

    expect(prisma.patient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: patientMock.id },
      })
    );
    expect(result).toEqual(updated);
  });

  it('should soft delete a patient', async () => {
    (prisma.patient.update as jest.Mock).mockResolvedValueOnce(patientMock);

    await repository.softDelete(patientMock.id, 'user-id');

    expect(prisma.patient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: patientMock.id },
        data: expect.objectContaining({
          deletedAt: expect.any(Date),
        }),
      })
    );
  });

  it('should restore a soft deleted patient', async () => {
    (prisma.patient.update as jest.Mock).mockResolvedValueOnce(patientMock);

    await repository.restore(patientMock.id, 'user-id');

    expect(prisma.patient.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: patientMock.id },
        data: expect.objectContaining({
          deletedAt: null,
        }),
      })
    );
  });
});
