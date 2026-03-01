/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeleteRoleUseCase } from './delete-role.use-case';

const mockRoleRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteRoleUseCase', () => {
  let useCase: DeleteRoleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteRoleUseCase(
      mockRoleRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete and create audit log', async () => {
    mockRoleRepository.findById.mockResolvedValueOnce({ id: 'role-1' });
    await useCase.execute({ id: 'role-1' });

    expect(mockRoleRepository.softDelete).toHaveBeenCalledWith(
      'role-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'ROLE' })
    );
  });

  it('should throw NotFoundError when not found', async () => {
    mockRoleRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
