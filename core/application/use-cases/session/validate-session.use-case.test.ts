/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  InvalidTokenError,
  SessionExpiredError,
} from '@/core/domain/errors/session.error';
import { ValidateSessionUseCase } from './validate-session.use-case';

const mockSessionRepository = { findById: jest.fn() };
const mockRoleRepository = { findById: jest.fn() };
const mockTokenProvider = { verifyToken: jest.fn() };

describe('ValidateSessionUseCase', () => {
  let useCase: ValidateSessionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new ValidateSessionUseCase(
      mockSessionRepository as any,
      mockRoleRepository as any,
      mockTokenProvider as any
    );
  });

  it('should return session data for a valid token', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      roleId: 'r1',
      roleCode: 'ADMIN',
      sid: 'sess-1',
      exp: Math.floor(Date.now() / 1000) + 3600,
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'sess-1',
      deletedAt: null,
    });

    const result = await useCase.execute({ token: 'valid-token' });

    expect(result).toEqual({
      userId: 'u1',
      roleId: 'r1',
      roleCode: 'ADMIN',
      sessionId: 'sess-1',
    });
  });

  it('should fallback to role lookup when roleCode missing in token', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      roleId: 'r1',
      sid: 'sess-1',
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'sess-1',
      deletedAt: null,
    });
    mockRoleRepository.findById.mockResolvedValueOnce({ code: 'USER' });

    const result = await useCase.execute({ token: 'tok' });

    expect(result.roleCode).toBe('USER');
    expect(mockRoleRepository.findById).toHaveBeenCalledWith('r1');
  });

  it('should throw InvalidTokenError for null decode', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce(null);
    await expect(useCase.execute({ token: 'bad' })).rejects.toThrow(
      InvalidTokenError
    );
  });

  it('should throw SessionExpiredError when session is revoked', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      roleId: 'r1',
      sid: 'sess-1',
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'sess-1',
      deletedAt: new Date(),
    });

    await expect(useCase.execute({ token: 'tok' })).rejects.toThrow(
      SessionExpiredError
    );
  });

  it('should throw InvalidTokenError when token is expired', async () => {
    mockTokenProvider.verifyToken.mockResolvedValueOnce({
      sub: 'u1',
      roleId: 'r1',
      roleCode: 'ADMIN',
      sid: 'sess-1',
      exp: Math.floor(Date.now() / 1000) - 1000,
    });
    mockSessionRepository.findById.mockResolvedValueOnce({
      id: 'sess-1',
      deletedAt: null,
    });

    await expect(useCase.execute({ token: 'expired' })).rejects.toThrow(
      InvalidTokenError
    );
  });
});
