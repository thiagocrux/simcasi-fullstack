/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/lib/logger.utils', () => ({
  logger: { error: jest.fn(), warn: jest.fn() },
}));

import { UnauthorizedError } from '@/core/domain/errors/app.error';
import {
  InvalidTokenError,
  SecurityBreachError,
  SessionExpiredError,
} from '@/core/domain/errors/session.error';
import { RefreshTokenUseCase } from './refresh-token.use-case';

const mockUserRepository = { findById: jest.fn() };
const mockSessionRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
  create: jest.fn(),
  revokeAllByUserId: jest.fn(),
};
const mockRoleRepository = { findById: jest.fn() };
const mockPermissionRepository = { findByRoleId: jest.fn() };
const mockTokenProvider = {
  verifyToken: jest.fn(),
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  getRefreshExpiryDate: jest.fn(),
  getAccessExpirationInSeconds: jest.fn(),
  getRefreshExpirationInSeconds: jest.fn(),
};

describe('RefreshTokenUseCase', () => {
  let useCase: RefreshTokenUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RefreshTokenUseCase(
      mockUserRepository as any,
      mockSessionRepository as any,
      mockRoleRepository as any,
      mockPermissionRepository as any,
      mockTokenProvider as any
    );
  });

  it('should rotate tokens successfully', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      sid: 'old-sess',
      rememberMe: false,
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'old-sess',
      deletedAt: null,
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      email: 'a@b.com',
      roleId: 'r1',
      deletedAt: null,
    });
    mockTokenProvider.getRefreshExpiryDate.mockReturnValueOnce(new Date());
    mockSessionRepository.create.mockResolvedValueOnce({ id: 'new-sess' });
    mockPermissionRepository.findByRoleId.mockResolvedValueOnce([
      { code: 'read:patient' },
    ]);
    mockRoleRepository.findById.mockResolvedValueOnce({
      id: 'r1',
      code: 'ADMIN',
    });
    mockTokenProvider.generateAccessToken.mockResolvedValueOnce('new-access');
    mockTokenProvider.generateRefreshToken.mockResolvedValueOnce('new-refresh');
    mockTokenProvider.getAccessExpirationInSeconds.mockReturnValueOnce(900);
    mockTokenProvider.getRefreshExpirationInSeconds.mockReturnValueOnce(604800);

    const result = await useCase.execute({ refreshToken: 'old-refresh' });

    expect(mockSessionRepository.softDelete).toHaveBeenCalledWith('old-sess');
    expect(result.accessToken).toBe('new-access');
    expect(result.refreshToken).toBe('new-refresh');
    expect(result.user.id).toBe('u1');
  });

  it('should throw InvalidTokenError for invalid refresh token', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce(null);
    await expect(useCase.execute({ refreshToken: 'bad' })).rejects.toThrow(
      InvalidTokenError
    );
  });

  it('should throw SessionExpiredError when session not found', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      sid: 'gone',
    });
    mockSessionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ refreshToken: 'tok' })).rejects.toThrow(
      SessionExpiredError
    );
  });

  it('should throw SecurityBreachError on token reuse beyond grace period', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      sid: 'old-sess',
    });
    // Session deleted more than 60s ago
    const deletedAt = new Date(Date.now() - 120_000);
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'old-sess',
      deletedAt,
    });

    await expect(useCase.execute({ refreshToken: 'tok' })).rejects.toThrow(
      SecurityBreachError
    );
    expect(mockSessionRepository.revokeAllByUserId).toHaveBeenCalledWith('u1');
  });

  it('should allow concurrent refresh within grace period', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      sid: 'old-sess',
      rememberMe: false,
    });
    // Session deleted 5 seconds ago (within 60s grace period)
    const deletedAt = new Date(Date.now() - 5_000);
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'old-sess',
      deletedAt,
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      email: 'a@b.com',
      roleId: 'r1',
      deletedAt: null,
    });
    mockTokenProvider.getRefreshExpiryDate.mockReturnValueOnce(new Date());
    mockSessionRepository.create.mockResolvedValueOnce({ id: 'new-sess' });
    mockPermissionRepository.findByRoleId.mockResolvedValueOnce([]);
    mockRoleRepository.findById.mockResolvedValueOnce({
      id: 'r1',
      code: 'USER',
    });
    mockTokenProvider.generateAccessToken.mockResolvedValueOnce('at');
    mockTokenProvider.generateRefreshToken.mockResolvedValueOnce('rt');
    mockTokenProvider.getAccessExpirationInSeconds.mockReturnValueOnce(900);
    mockTokenProvider.getRefreshExpirationInSeconds.mockReturnValueOnce(604800);

    const result = await useCase.execute({ refreshToken: 'tok' });

    expect(mockSessionRepository.revokeAllByUserId).not.toHaveBeenCalled();
    expect(result.accessToken).toBe('at');
  });

  it('should throw UnauthorizedError when user is deleted', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      sid: 'sess-1',
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'sess-1',
      deletedAt: null,
    });
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      deletedAt: new Date(),
    });

    await expect(useCase.execute({ refreshToken: 'tok' })).rejects.toThrow(
      UnauthorizedError
    );
  });
});
