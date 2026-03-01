/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { ResetPasswordUseCase } from './reset-password.use-case';

const mockUserRepository = { findById: jest.fn(), updatePassword: jest.fn() };
const mockTokenRepo = { findByToken: jest.fn(), markAsUsed: jest.fn() };
const mockHashProvider = { compare: jest.fn(), hash: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('ResetPasswordUseCase', () => {
  let useCase: ResetPasswordUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ResetPasswordUseCase(
      mockUserRepository as any,
      mockTokenRepo as any,
      mockHashProvider as any,
      mockAuditLogRepository as any
    );
  });

  it('should reset password successfully', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce({
      id: 'tok-1',
      userId: 'u1',
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'old-hash',
    });
    mockHashProvider.compare.mockResolvedValueOnce(false);
    mockHashProvider.hash.mockResolvedValueOnce('new-hash');
    mockUserRepository.updatePassword.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      password: 'new-hash',
    });

    const result = await useCase.execute({
      token: 'valid-tok',
      newPassword: 'newpass',
    });

    expect(mockTokenRepo.markAsUsed).toHaveBeenCalledWith('tok-1');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'PASSWORD_RESET' })
    );
    expect(result).not.toHaveProperty('password');
  });

  it('should throw ValidationError for invalid token', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ token: 'bad', newPassword: 'p' })
    ).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when user not found', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce({
      id: 'tok-1',
      userId: 'u1',
    });
    mockUserRepository.findById.mockResolvedValueOnce(null);

    await expect(
      useCase.execute({ token: 'tok', newPassword: 'p' })
    ).rejects.toThrow(NotFoundError);
  });

  it('should throw ValidationError when new password same as current', async () => {
    mockTokenRepo.findByToken.mockResolvedValueOnce({
      id: 'tok-1',
      userId: 'u1',
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'old-hash',
    });
    mockHashProvider.compare.mockResolvedValueOnce(true); // same password

    await expect(
      useCase.execute({ token: 'tok', newPassword: 'same' })
    ).rejects.toThrow(ValidationError);
  });
});
