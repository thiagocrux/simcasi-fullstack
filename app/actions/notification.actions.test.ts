/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createNotification,
  deleteNotification,
  findNotifications,
  getNotification,
  updateNotification,
} from './notification.actions';

jest.mock('@/core/infrastructure/factories/notification.factory');
jest.mock('next/cache', () => ({ revalidatePath: jest.fn() }));
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback(),
}));

import * as notificationFactory from '@/core/infrastructure/factories/notification.factory';
const {
  makeFindNotificationsUseCase,
  makeGetNotificationByIdUseCase,
  makeRegisterNotificationUseCase,
  makeUpdateNotificationUseCase,
  makeDeleteNotificationUseCase,
} = notificationFactory as any;

describe('Notification Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findNotifications', () => {
    it('should execute find use case', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindNotificationsUseCase.mockReturnValue(mockUseCase);

      await findNotifications({ skip: 0, take: 10 });

      expect(makeFindNotificationsUseCase).toHaveBeenCalled();
    });
  });

  describe('getNotification', () => {
    it('should retrieve notification with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeGetNotificationByIdUseCase.mockReturnValue(mockUseCase);

      await getNotification(VALID_UUID);

      expect(makeGetNotificationByIdUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getNotification('invalid-uuid')).rejects.toThrow();
    });
  });

  describe('createNotification', () => {
    it('should create notification with valid input', async () => {
      const validInput = {
        patientId: VALID_UUID,
        sinan: '1234567',
        createdBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeRegisterNotificationUseCase.mockReturnValue(mockUseCase);

      await createNotification(validInput);

      expect(makeRegisterNotificationUseCase).toHaveBeenCalled();
    });
  });

  describe('updateNotification', () => {
    it('should update notification with valid input', async () => {
      const updateData = {
        observations: 'Updated observation',
        updatedBy: VALID_UUID,
      };
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({ id: VALID_UUID }),
      };
      makeUpdateNotificationUseCase.mockReturnValue(mockUseCase);

      await updateNotification(VALID_UUID, updateData);

      expect(makeUpdateNotificationUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(
        updateNotification('invalid-id', { updatedBy: VALID_UUID })
      ).rejects.toThrow();
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue(undefined),
      };
      makeDeleteNotificationUseCase.mockReturnValue(mockUseCase);

      await deleteNotification(VALID_UUID);

      expect(makeDeleteNotificationUseCase).toHaveBeenCalled();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(deleteNotification('invalid-id')).rejects.toThrow();
    });
  });
});
