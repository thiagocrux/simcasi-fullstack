/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'u1',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import {
  ForbiddenError,
  NotFoundError,
  ValidationError,
} from '@/core/domain/errors/app.error';
import { ChangePasswordUseCase } from './change-password.use-case';

const mockUserRepository = { findById: jest.fn(), updatePassword: jest.fn() };
const mockHashProvider = { compare: jest.fn(), hash: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('ChangePasswordUseCase', () => {
  let useCase: ChangePasswordUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ChangePasswordUseCase(
      mockUserRepository as any,
      mockHashProvider as any,
      mockAuditLogRepository as any
    );
  });

  it('should change password successfully', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'old-hash',
    });
    mockHashProvider.compare
      .mockResolvedValueOnce(true) // current password matches
      .mockResolvedValueOnce(false); // new password is different
    mockHashProvider.hash.mockResolvedValueOnce('new-hash');
    mockUserRepository.updatePassword.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      password: 'new-hash',
    });

    const result = await useCase.execute({
      userId: 'u1',
      currentPassword: 'old',
      newPassword: 'new',
    });

    expect(result).not.toHaveProperty('password');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'PASSWORD_CHANGE' })
    );
  });

  it('should throw ForbiddenError when changing another user password', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'other',
      password: 'h',
    });

    await expect(
      useCase.execute({
        userId: 'other',
        currentPassword: 'old',
        newPassword: 'new',
      })
    ).rejects.toThrow(ForbiddenError);
  });

  it('should throw ValidationError when current password is incorrect', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
    });
    mockHashProvider.compare.mockResolvedValueOnce(false);

    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'wrong',
        newPassword: 'new',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw ValidationError when new password is same as current', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
    });
    mockHashProvider.compare
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true);

    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'same',
        newPassword: 'same',
      })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);
    await expect(
      useCase.execute({
        userId: 'u1',
        currentPassword: 'a',
        newPassword: 'b',
      })
    ).rejects.toThrow(NotFoundError);
  });
});
