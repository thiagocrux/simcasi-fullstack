/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-require-imports */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/notification.schema', () => ({
  notificationSchema: {
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError } from '@/core/domain/errors/app.error';
import { UpdateNotificationUseCase } from './update-notification.use-case';

const mockNotificationRepository = { findById: jest.fn(), update: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('UpdateNotificationUseCase', () => {
  let useCase: UpdateNotificationUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new UpdateNotificationUseCase(
      mockNotificationRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should update and create audit log', async () => {
    const {
      notificationSchema,
    } = require('@/core/application/validation/schemas/notification.schema');
    notificationSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: { sinan: '999' } })),
    });
    mockNotificationRepository.findById.mockResolvedValueOnce({ id: 'n1' });
    mockNotificationRepository.update.mockResolvedValueOnce({
      id: 'n1',
      sinan: '999',
    });

    const result = await useCase.execute({ id: 'n1', sinan: '999' } as any);

    expect(mockNotificationRepository.update).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalled();
    expect(result).toEqual({ id: 'n1', sinan: '999' });
  });

  it('should throw NotFoundError when notification does not exist', async () => {
    const {
      notificationSchema,
    } = require('@/core/application/validation/schemas/notification.schema');
    notificationSchema.partial.mockReturnValueOnce({
      safeParse: jest.fn(() => ({ success: true, data: {} })),
    });
    mockNotificationRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute({ id: 'x' } as any)).rejects.toThrow(
      NotFoundError
    );
  });
});
