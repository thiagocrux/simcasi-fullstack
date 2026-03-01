/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/infrastructure/lib/env.config', () => ({
  env: { NEXT_PUBLIC_APP_URL: 'http://localhost:3000' },
}));

jest.mock('node:crypto', () => ({
  randomUUID: jest.fn(() => 'mock-uuid'),
}));

import { RequestPasswordResetUseCase } from './request-password-reset.use-case';

const mockUserRepository = { findByEmail: jest.fn() };
const mockTokenRepo = {
  invalidateAllForUser: jest.fn(),
  create: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };
const mockMailProvider = { send: jest.fn() };

describe('RequestPasswordResetUseCase', () => {
  let useCase: RequestPasswordResetUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RequestPasswordResetUseCase(
      mockUserRepository as any,
      mockTokenRepo as any,
      mockAuditLogRepository as any,
      mockMailProvider as any
    );
  });

  it('should send reset email for existing user', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
    });

    const result = await useCase.execute({ email: 'a@b.com' });

    expect(mockTokenRepo.invalidateAllForUser).toHaveBeenCalledWith('u1');
    expect(mockTokenRepo.create).toHaveBeenCalledWith(
      expect.objectContaining({ userId: 'u1', token: 'mock-uuid' })
    );
    expect(mockMailProvider.send).toHaveBeenCalledWith(
      expect.objectContaining({ to: 'a@b.com' })
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result.message).toBeDefined();
  });

  it('should return success message even for unknown email (anti-enumeration)', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(null);

    const result = await useCase.execute({ email: 'unknown@test.com' });

    expect(result.message).toBeDefined();
    expect(mockMailProvider.send).not.toHaveBeenCalled();
  });
});
