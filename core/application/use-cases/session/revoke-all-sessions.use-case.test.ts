/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { RevokeAllSessionsUseCase } from './revoke-all-sessions.use-case';

const mockSessionRepository = { revokeAllByUserId: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RevokeAllSessionsUseCase', () => {
  let useCase: RevokeAllSessionsUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RevokeAllSessionsUseCase(
      mockSessionRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should revoke all sessions for the given user', async () => {
    mockSessionRepository.revokeAllByUserId.mockResolvedValueOnce(undefined);
    mockAuditLogRepository.create.mockResolvedValueOnce(undefined);

    const result = await useCase.execute({ userId: 'user-123' });

    expect(mockSessionRepository.revokeAllByUserId).toHaveBeenCalledWith(
      'user-123'
    );
    expect(result).toEqual({ success: true });
  });

  it('should create an audit log entry with actor context after revoking', async () => {
    mockSessionRepository.revokeAllByUserId.mockResolvedValueOnce(undefined);
    mockAuditLogRepository.create.mockResolvedValueOnce(undefined);

    await useCase.execute({ userId: 'user-123' });

    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        userId: 'ctx-user-id',
        entityId: 'user-123',
        ipAddress: '127.0.0.1',
        userAgent: 'Jest',
      })
    );
  });

  it('should call revokeAllByUserId before creating audit log', async () => {
    const callOrder: string[] = [];
    mockSessionRepository.revokeAllByUserId.mockImplementationOnce(async () => {
      callOrder.push('revokeAllByUserId');
    });
    mockAuditLogRepository.create.mockImplementationOnce(async () => {
      callOrder.push('auditLog');
    });

    await useCase.execute({ userId: 'user-456' });

    expect(callOrder).toEqual(['revokeAllByUserId', 'auditLog']);
  });
});
