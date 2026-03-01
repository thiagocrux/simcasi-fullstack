/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreRoleUseCase } from './restore-role.use-case';

const mockRoleRepository = { findById: jest.fn(), restore: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RestoreRoleUseCase', () => {
  let useCase: RestoreRoleUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RestoreRoleUseCase(
      mockRoleRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore a deleted role and create audit log', async () => {
    const deleted = { id: 'role-1', deletedAt: new Date() };
    const restored = { id: 'role-1', deletedAt: null };
    mockRoleRepository.findById
      .mockResolvedValueOnce(deleted)
      .mockResolvedValueOnce(restored);

    const result = await useCase.execute({ id: 'role-1' });

    expect(mockRoleRepository.restore).toHaveBeenCalledWith(
      'role-1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE', entityName: 'ROLE' })
    );
    expect(result).toEqual(restored);
  });

  it('should skip restoration if not deleted', async () => {
    const existing = { id: 'role-1', deletedAt: null };
    mockRoleRepository.findById
      .mockResolvedValueOnce(existing)
      .mockResolvedValueOnce(existing);

    const result = await useCase.execute({ id: 'role-1' });

    expect(mockRoleRepository.restore).not.toHaveBeenCalled();
    expect(result).toEqual(existing);
  });

  it('should throw NotFoundError when not found', async () => {
    mockRoleRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
