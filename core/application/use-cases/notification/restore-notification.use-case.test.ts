/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreNotificationUseCase } from './restore-notification.use-case';

const mockNotificationRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestoreNotificationUseCase', () => {
  let useCase: RestoreNotificationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreNotificationUseCase(
      mockNotificationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a deleted notification and create audit log', async () => {
    const deleted = { id: 'n1', deletedAt: new Date() };
    const restored = { id: 'n1', deletedAt: null };
    mockNotificationRepository.findById
      .mockResolvedValueOnce(deleted) // findById(id, true)
      .mockResolvedValueOnce(restored); // re-fetch after restore

    const result = await useCase.execute({ id: 'n1' });

    expect(mockNotificationRepository.restore).toHaveBeenCalledWith(
      'n1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'RESTORE',
        entityName: 'NOTIFICATION',
      })
    );
    expect(result).toEqual(restored);
  });

  it('should still re-fetch and create audit log when not deleted', async () => {
    const existing = { id: 'n1', deletedAt: null };
    mockNotificationRepository.findById
      .mockResolvedValueOnce(existing) // findById(id, true)
      .mockResolvedValueOnce(existing); // re-fetch

    const result = await useCase.execute({ id: 'n1' });

    expect(mockNotificationRepository.restore).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when not found', async () => {
    mockNotificationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
