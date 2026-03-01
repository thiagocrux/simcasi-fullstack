/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestorePatientUseCase } from './restore-patient.use-case';

const mockPatientRepository = { findById: jest.fn(), restore: jest.fn() };
const mockExamRepository = { restoreByPatientId: jest.fn() };
const mockNotificationRepository = { restoreByPatientId: jest.fn() };
const mockObservationRepository = { restoreByPatientId: jest.fn() };
const mockTreatmentRepository = { restoreByPatientId: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestorePatientUseCase', () => {
  let useCase: RestorePatientUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestorePatientUseCase(
      mockPatientRepository as any,
      mockExamRepository as any,
      mockNotificationRepository as any,
      mockObservationRepository as any,
      mockTreatmentRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore patient and cascade restore related records', async () => {
    const deletionDate = new Date('2025-01-01');
    mockPatientRepository.findById.mockResolvedValueOnce({
      id: 'p1',
      deletedAt: deletionDate,
    });

    const result = await useCase.execute({ id: 'p1' });

    expect(mockPatientRepository.restore).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id'
    );
    expect(mockExamRepository.restoreByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id',
      deletionDate
    );
    expect(mockNotificationRepository.restoreByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id',
      deletionDate
    );
    expect(mockObservationRepository.restoreByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id',
      deletionDate
    );
    expect(mockTreatmentRepository.restoreByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id',
      deletionDate
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE', entityName: 'PATIENT' })
    );
    expect(result.deletedAt).toBeNull();
  });

  it('should return without restoring if patient is not deleted', async () => {
    mockPatientRepository.findById.mockResolvedValueOnce({
      id: 'p1',
      deletedAt: null,
    });

    const result = await useCase.execute({ id: 'p1' });

    expect(mockPatientRepository.restore).not.toHaveBeenCalled();
    expect(result).toEqual({ id: 'p1', deletedAt: null });
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    mockPatientRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
