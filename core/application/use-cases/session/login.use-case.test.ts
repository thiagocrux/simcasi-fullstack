/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import {
  NotFoundError,
  UnauthorizedError,
} from '@/core/domain/errors/app.error';
import { LoginUseCase } from './login.use-case';

const mockUserRepository = { findByEmail: jest.fn() };
const mockSessionRepository = {
  create: jest.fn(),
  revokeOtherSessions: jest.fn(),
};
const mockRoleRepository = { findById: jest.fn() };
const mockPermissionRepository = { findByRoleId: jest.fn() };
const mockHashProvider = { compare: jest.fn() };
const mockTokenProvider = {
  generateAccessToken: jest.fn(),
  generateRefreshToken: jest.fn(),
  getRefreshExpiryDate: jest.fn(),
  getAccessExpirationInSeconds: jest.fn(),
  getRefreshExpirationInSeconds: jest.fn(),
};

describe('LoginUseCase', () => {
  let useCase: LoginUseCase;

  const validInput = { email: 'a@b.com', password: 'pass', rememberMe: false };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new LoginUseCase(
      mockUserRepository as any,
      mockSessionRepository as any,
      mockRoleRepository as any,
      mockPermissionRepository as any,
      mockHashProvider as any,
      mockTokenProvider as any
    );
  });

  it('should authenticate and return tokens', async () => {
    const user = {
      id: 'u1',
      name: 'User',
      email: 'a@b.com',
      password: 'hashed',
      roleId: 'r1',
      deletedAt: null,
      isSystem: false,
    };
    mockUserRepository.findByEmail.mockResolvedValueOnce(user);
    mockHashProvider.compare.mockResolvedValueOnce(true);
    mockTokenProvider.getRefreshExpiryDate.mockReturnValueOnce(new Date());
    mockSessionRepository.create.mockResolvedValueOnce({ id: 'sess-1' });
    mockSessionRepository.revokeOtherSessions.mockResolvedValueOnce(undefined);
    mockPermissionRepository.findByRoleId.mockResolvedValueOnce([
      { code: 'create:patient' },
    ]);
    mockRoleRepository.findById.mockResolvedValueOnce({
      id: 'r1',
      code: 'ADMIN',
    });
    mockTokenProvider.generateAccessToken.mockResolvedValueOnce('access-tok');
    mockTokenProvider.generateRefreshToken.mockResolvedValueOnce('refresh-tok');
    mockTokenProvider.getAccessExpirationInSeconds.mockReturnValueOnce(900);
    mockTokenProvider.getRefreshExpirationInSeconds.mockReturnValueOnce(604800);

    const result = await useCase.execute(validInput);

    expect(result.accessToken).toBe('access-tok');
    expect(result.refreshToken).toBe('refresh-tok');
    expect(result.user.id).toBe('u1');
    expect(result.permissions).toEqual(['create:patient']);
  });

  it('should throw UnauthorizedError when user not found', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);
    await expect(useCase.execute(validInput)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError when user is deleted', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      deletedAt: new Date(),
    });
    await expect(useCase.execute(validInput)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError when user is system', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      isSystem: true,
      deletedAt: null,
    });
    await expect(useCase.execute(validInput)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw UnauthorizedError when password is invalid', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      password: 'hashed',
      deletedAt: null,
      isSystem: false,
    });
    mockHashProvider.compare.mockResolvedValueOnce(false);
    await expect(useCase.execute(validInput)).rejects.toThrow(
      UnauthorizedError
    );
  });

  it('should throw NotFoundError when role not found', async () => {
    const user = {
      id: 'u1',
      password: 'hashed',
      roleId: 'r1',
      deletedAt: null,
      isSystem: false,
    };
    mockUserRepository.findByEmail.mockResolvedValueOnce(user);
    mockHashProvider.compare.mockResolvedValueOnce(true);
    mockTokenProvider.getRefreshExpiryDate.mockReturnValueOnce(new Date());
    mockSessionRepository.create.mockResolvedValueOnce({ id: 'sess-1' });
    mockSessionRepository.revokeOtherSessions.mockResolvedValueOnce(undefined);
    mockPermissionRepository.findByRoleId.mockResolvedValueOnce([]);
    mockRoleRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });
});
