/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreTreatmentUseCase } from './restore-treatment.use-case';

const mockTreatmentRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestoreTreatmentUseCase', () => {
  let useCase: RestoreTreatmentUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreTreatmentUseCase(
      mockTreatmentRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a deleted treatment and create audit log', async () => {
    const existing = { id: 't1', deletedAt: new Date(), updatedBy: null };
    mockTreatmentRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 't1' });

    expect(mockTreatmentRepository.restore).toHaveBeenCalledWith(
      't1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result.deletedAt).toBeNull();
  });

  it('should return without restoring if not deleted', async () => {
    const existing = { id: 't1', deletedAt: null };
    mockTreatmentRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 't1' });

    expect(mockTreatmentRepository.restore).not.toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when not found', async () => {
    mockTreatmentRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
