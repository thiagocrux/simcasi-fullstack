/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestorePermissionUseCase } from './restore-permission.use-case';

const mockPermissionRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestorePermissionUseCase', () => {
  let useCase: RestorePermissionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestorePermissionUseCase(
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a deleted permission and create audit log', async () => {
    const deleted = { id: 'perm-1', deletedAt: new Date() };
    const restored = { id: 'perm-1', deletedAt: null };
    mockPermissionRepository.findById
      .mockResolvedValueOnce(deleted)
      .mockResolvedValueOnce(restored);

    const result = await useCase.execute({ id: 'perm-1' });

    expect(mockPermissionRepository.restore).toHaveBeenCalledWith(
      'perm-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE', entityName: 'PERMISSION' })
    );
    expect(result).toEqual(restored);
  });

  it('should still re-fetch and audit when not deleted', async () => {
    const existing = { id: 'perm-1', deletedAt: null };
    mockPermissionRepository.findById
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'perm-1' });

    expect(mockPermissionRepository.restore).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when not found', async () => {
    mockPermissionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
