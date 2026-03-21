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
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({})),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterNotificationUseCase } from './register-notification.use-case';

const mockNotificationRepository = { create: jest.fn(), findById: jest.fn() };
const mockPatientRepository = { findById: jest.fn() };
const mockAuditLogRepository = { create: jest.fn() };

describe('RegisterNotificationUseCase', () => {
  let useCase: RegisterNotificationUseCase;

  const validInput = {
    patientId: 'patient-1',
    sinan: '1234567890123',
    observations: 'Test',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterNotificationUseCase(
      mockNotificationRepository as any,
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create a notification and audit log', async () => {
    const {
      notificationSchema,
    } = require('@/core/application/validation/schemas/notification.schema');
    notificationSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce({ id: 'patient-1' });
    const created = { id: 'notif-1', ...validInput };
    mockNotificationRepository.create.mockResolvedValueOnce(created);

    const result = await useCase.execute(validInput);

    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({ action: 'CREATE', entityName: 'NOTIFICATION' })
    );
    expect(result).toEqual(created);
  });

  it('should throw ValidationError on invalid input', async () => {
    const {
      notificationSchema,
    } = require('@/core/application/validation/schemas/notification.schema');
    notificationSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: { issues: [] },
    });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    const {
      notificationSchema,
    } = require('@/core/application/validation/schemas/notification.schema');
    notificationSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });
});
