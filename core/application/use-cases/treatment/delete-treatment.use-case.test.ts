/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeleteTreatmentUseCase } from './delete-treatment.use-case';

const mockTreatmentRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteTreatmentUseCase', () => {
  let useCase: DeleteTreatmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteTreatmentUseCase(
      mockTreatmentRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete and create audit log', async () => {
    mockTreatmentRepository.findById.mockResolvedValueOnce({ id: 't1' });
    await useCase.execute({ id: 't1' });

    expect(mockTreatmentRepository.softDelete).toHaveBeenCalledWith(
      't1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'TREATMENT' })
    );
  });

  it('should throw NotFoundError when not found', async () => {
    mockTreatmentRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
