/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { RestoreUserUseCase } from './restore-user.use-case';

const mockUserRepository = {
  findById: jest.fn(),
  restore: jest.fn(),
} as jest.Mocked<{
  findById: jest.Mock;
  restore: jest.Mock;
}>;
const mockAuditLogRepository = {
  create: jest.fn(),
} as jest.Mocked<{
  create: jest.Mock;
}>;

describe('RestoreUserUseCase', () => {
  let useCase: RestoreUserUseCase;

  beforeEach(() => {
    jest.clearAllMocks();

    useCase = new RestoreUserUseCase(
      mockUserRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should restore deleted user and create audit log', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      name: 'User',
      password: 'h',
      deletedAt: new Date(),
    });

    const result = await useCase.execute({ id: 'u1' });

    expect(mockUserRepository.restore).toHaveBeenCalledWith(
      'u1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'RESTORE', entityName: 'USER' })
    );
    expect(result.id).toBe('u1');
    expect(result.deletedAt).toBeNull();
  });

  it('should skip restoration if user is not deleted', async () => {
    mockUserRepository.findById.mockResolvedValueOnce({
      id: 'u1',
      password: 'h',
      deletedAt: null,
    });

    const result = await useCase.execute({ id: 'u1' });

    expect(mockUserRepository.restore).not.toHaveBeenCalled();
    expect(mockAuditLogRepository.create).not.toHaveBeenCalled();
    expect(result.id).toBe('u1');
  });

  it('should throw NotFoundError when not found', async () => {
    mockUserRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
