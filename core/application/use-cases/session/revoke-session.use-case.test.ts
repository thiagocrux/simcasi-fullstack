/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RevokeSessionUseCase } from './revoke-session.use-case';

const mockSessionRepository = { findById: jest.fn(), softDelete: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RevokeSessionUseCase', () => {
  let useCase: RevokeSessionUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RevokeSessionUseCase(
      mockSessionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should revoke session and create audit log', async () => {
    mockSessionRepository.findById.mockResolvedValueOnce({ id: 'sess-1' });
    const result = await useCase.execute({ id: 'sess-1' });

    expect(mockSessionRepository.softDelete).toHaveBeenCalledWith('sess-1');
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'REVOKE_SESSION',
        entityName: 'SESSION',
      })
    );
    expect(result).toEqual({ success: true });
  });

  it('should throw NotFoundError when session not found', async () => {
    mockSessionRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
