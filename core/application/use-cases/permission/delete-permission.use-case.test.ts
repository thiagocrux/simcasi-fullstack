/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeletePermissionUseCase } from './delete-permission.use-case';

const mockPermissionRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeletePermissionUseCase', () => {
  let useCase: DeletePermissionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeletePermissionUseCase(
      mockPermissionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete and create audit log', async () => {
    mockPermissionRepository.findById.mockResolvedValueOnce({ id: 'perm-1' });
    await useCase.execute({ id: 'perm-1' });

    expect(mockPermissionRepository.softDelete).toHaveBeenCalledWith(
      'perm-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'PERMISSION' })
    );
  });

  it('should throw NotFoundError when not found', async () => {
    mockPermissionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
