/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { UpdateObservationUseCase } from './update-observation.use-case';

const mockObservationRepository = { findById: jest.fn(), update: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateObservationUseCase', () => {
  let useCase: UpdateObservationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateObservationUseCase(
      mockObservationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update the observation and create audit log (no Zod validation)', async () => {
    const existing = { id: 'obs-1', observations: 'Old' };
    const updated = { id: 'obs-1', observations: 'New' };
    mockObservationRepository.findById.mockResolvedValueOnce(existing);
    mockObservationRepository.update.mockResolvedValueOnce(updated);

    const result = await useCase.execute({
      id: 'obs-1',
      observations: 'New',
    } as any);

    expect(mockObservationRepository.update).toHaveBeenCalledWith(
      'obs-1',
      { observations: 'New' },
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'UPDATE', entityName: 'OBSERVATION' })
    );
    expect(result).toEqual(updated);
  });

  it('should throw NotFoundError when not found', async () => {
    mockObservationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
