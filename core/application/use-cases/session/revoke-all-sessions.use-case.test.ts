/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    roleId: 'role-id',
    roleCode: 'admin',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { ForbiddenError } from '@/core/domain/errors/app.error';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
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

  it('should throw ForbiddenError when viewer tries to revoke sessions of another user', async () => {
    const viewerCtx = {
      userId: 'ctx-user-id',
      roleId: 'role-id',
      roleCode: 'viewer',
      ipAddress: '127.0.0.1',
      userAgent: 'Jest',
    };
    jest
      .mocked(getRequestContext)
      .mockReturnValueOnce(viewerCtx)
      .mockReturnValueOnce(viewerCtx);

    await expect(useCase.execute({ userId: 'other-user' })).rejects.toThrow(
      ForbiddenError
    );
  });

  it('should allow viewer to revoke their own sessions', async () => {
    const viewerCtx = {
      userId: 'ctx-user-id',
      roleId: 'role-id',
      roleCode: 'viewer',
      ipAddress: '127.0.0.1',
      userAgent: 'Jest',
    };
    jest
      .mocked(getRequestContext)
      .mockReturnValueOnce(viewerCtx)
      .mockReturnValueOnce(viewerCtx);
    mockSessionRepository.revokeAllByUserId.mockResolvedValueOnce(undefined);
    mockAuditLogRepository.create.mockResolvedValueOnce(undefined);

    const result = await useCase.execute({ userId: 'ctx-user-id' });

    expect(result).toEqual({ success: true });
  });
});
