/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/domain/utils/user.utils', () => ({
  isImmutableEmail: jest.fn(() => false),
}));

jest.mock('@/core/infrastructure/lib/env.config', () => ({
  env: { NEXT_PUBLIC_DEFAULT_USER_EMAIL: 'system@test.com' },
}));

import { ForbiddenError, NotFoundError } from '@/core/domain/errors/app.error';
import * as userUtils from '@/core/domain/utils/user.utils';
import { DeleteUserUseCase } from './delete-user.use-case';

const mockUserRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockSessionRepository = { revokeAllByUserId: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteUserUseCase', () => {
  let useCase: DeleteUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteUserUseCase(
      mockUserRepository as any,
      mockSessionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete user and revoke sessions', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      email: 'user@test.com',
      isSystem: false,
      password: 'h',
    });

    await useCase.execute({ id: 'u1' });

    expect(mockUserRepository.softDelete).toHaveBeenCalledWith(
      'u1',
      'ctx-user-id'
    );
    expect(mockSessionRepository.revokeAllByUserId).toHaveBeenCalledWith('u1');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'USER' })
    );
  });

  it('should throw ForbiddenError for system user', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      isSystem: true,
      email: 'a@b.com',
    });

    await expect(useCase.execute({ id: 'u1' })).rejects.toThrow(ForbiddenError);
  });

  it('should throw ForbiddenError for immutable email user', async () => {
    (userUtils.isImmutableEmail as jest.Mock).mockReturnValueOnce(true);

    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      isSystem: false,
      email: 'system@test.com',
    });

    await expect(useCase.execute({ id: 'u1' })).rejects.toThrow(ForbiddenError);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
