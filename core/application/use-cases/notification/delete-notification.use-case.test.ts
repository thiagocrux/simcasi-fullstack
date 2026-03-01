/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { DeleteNotificationUseCase } from './delete-notification.use-case';

const mockNotificationRepository = {
  findById: jest.fn(),
  softDelete: jest.fn(),
};
const mockAuditLogRepository = { create: jest.fn() };

describe('DeleteNotificationUseCase', () => {
  let useCase: DeleteNotificationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new DeleteNotificationUseCase(
      mockNotificationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should soft delete and create audit log', async () => {
    mockNotificationRepository.findById.mockResolvedValueOnce({ id: 'n1' });

    await useCase.execute({ id: 'n1' });

    expect(mockNotificationRepository.softDelete).toHaveBeenCalledWith(
      'n1',
      'ctx-user-id'
    );
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'DELETE', entityName: 'NOTIFICATION' })
    );
  });

  it('should throw NotFoundError when not found', async () => {
    mockNotificationRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
