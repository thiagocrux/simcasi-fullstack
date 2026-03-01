/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeleteObservationUseCase } from './delete-observation.use-case';

const mockObservationRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteObservationUseCase', () => {
  let useCase: DeleteObservationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteObservationUseCase(
      mockObservationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete and create audit log', async () => {
    mockObservationRepository.findById.mockResolvedValueOnce({ id: 'obs-1' });
    await useCase.execute({ id: 'obs-1' });

    expect(mockObservationRepository.softDelete).toHaveBeenCalledWith(
      'obs-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'OBSERVATION' })
    );
  });

  it('should throw NotFoundError when not found', async () => {
    mockObservationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
