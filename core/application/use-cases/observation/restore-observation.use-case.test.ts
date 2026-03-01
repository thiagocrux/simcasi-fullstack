/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreObservationUseCase } from './restore-observation.use-case';

const mockObservationRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestoreObservationUseCase', () => {
  let useCase: RestoreObservationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreObservationUseCase(
      mockObservationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a deleted observation and create audit log', async () => {
    const existing = { id: 'obs-1', deletedAt: new Date(), updatedBy: null };
    mockObservationRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'obs-1' });

    expect(mockObservationRepository.restore).toHaveBeenCalledWith(
      'obs-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result.deletedAt).toBeNull();
  });

  it('should return without restoring if not deleted', async () => {
    const existing = { id: 'obs-1', deletedAt: null };
    mockObservationRepository.findById.mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'obs-1' });

    expect(mockObservationRepository.restore).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when not found', async () => {
    mockObservationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
