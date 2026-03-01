/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeletePatientUseCase } from './delete-patient.use-case';

const mockPatientRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockExamRepository = { softDeleteByPatientId: jest.fn() };
const mockNotificationRepository = { softDeleteByPatientId: jest.fn() };
const mockObservationRepository = { softDeleteByPatientId: jest.fn() };
const mockTreatmentRepository = { softDeleteByPatientId: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeletePatientUseCase', () => {
  let useCase: DeletePatientUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeletePatientUseCase(
      mockPatientRepository as any,
      mockExamRepository as any,
      mockNotificationRepository as any,
      mockObservationRepository as any,
      mockTreatmentRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete patient and cascade to related records', async () => {
    mockPatientRepository.findById.mockResolvedValueOnce({ id: 'p1' });

    await useCase.execute({ id: 'p1' });

    expect(mockPatientRepository.softDelete).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id'
    );
    expect(mockExamRepository.softDeleteByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id'
    );
    expect(
      mockNotificationRepository.softDeleteByPatientId
    ).toHaveBeenCalledWith('p1', 'ctx-user-id');
    expect(
      mockObservationRepository.softDeleteByPatientId
    ).toHaveBeenCalledWith('p1', 'ctx-user-id');
    expect(mockTreatmentRepository.softDeleteByPatientId).toHaveBeenCalledWith(
      'p1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'PATIENT' })
    );
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    mockPatientRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
