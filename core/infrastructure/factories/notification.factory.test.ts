import { DeleteNotificationUseCase } from '@/core/application/use-cases/notification/delete-notification.use-case';
import { FindNotificationsUseCase } from '@/core/application/use-cases/notification/find-notifications.use-case';
import { GetNotificationByIdUseCase } from '@/core/application/use-cases/notification/get-notification-by-id.use-case';
import { RegisterNotificationUseCase } from '@/core/application/use-cases/notification/register-notification.use-case';
import { RestoreNotificationUseCase } from '@/core/application/use-cases/notification/restore-notification.use-case';
import { UpdateNotificationUseCase } from '@/core/application/use-cases/notification/update-notification.use-case';
import {
  makeDeleteNotificationUseCase,
  makeFindNotificationsUseCase,
  makeGetNotificationByIdUseCase,
  makeRegisterNotificationUseCase,
  makeRestoreNotificationUseCase,
  makeUpdateNotificationUseCase,
} from './notification.factory';

describe('notification.factory', () => {
  describe('makeRegisterNotificationUseCase', () => {
    it('should return an instance of RegisterNotificationUseCase', () => {
      const useCase = makeRegisterNotificationUseCase();
      expect(useCase).toBeInstanceOf(RegisterNotificationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRegisterNotificationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRegisterNotificationUseCase();
      const useCase2 = makeRegisterNotificationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeFindNotificationsUseCase', () => {
    it('should return an instance of FindNotificationsUseCase', () => {
      const useCase = makeFindNotificationsUseCase();
      expect(useCase).toBeInstanceOf(FindNotificationsUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeFindNotificationsUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeFindNotificationsUseCase();
      const useCase2 = makeFindNotificationsUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeGetNotificationByIdUseCase', () => {
    it('should return an instance of GetNotificationByIdUseCase', () => {
      const useCase = makeGetNotificationByIdUseCase();
      expect(useCase).toBeInstanceOf(GetNotificationByIdUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeGetNotificationByIdUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeGetNotificationByIdUseCase();
      const useCase2 = makeGetNotificationByIdUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeUpdateNotificationUseCase', () => {
    it('should return an instance of UpdateNotificationUseCase', () => {
      const useCase = makeUpdateNotificationUseCase();
      expect(useCase).toBeInstanceOf(UpdateNotificationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeUpdateNotificationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeUpdateNotificationUseCase();
      const useCase2 = makeUpdateNotificationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeDeleteNotificationUseCase', () => {
    it('should return an instance of DeleteNotificationUseCase', () => {
      const useCase = makeDeleteNotificationUseCase();
      expect(useCase).toBeInstanceOf(DeleteNotificationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeDeleteNotificationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeDeleteNotificationUseCase();
      const useCase2 = makeDeleteNotificationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });

  describe('makeRestoreNotificationUseCase', () => {
    it('should return an instance of RestoreNotificationUseCase', () => {
      const useCase = makeRestoreNotificationUseCase();
      expect(useCase).toBeInstanceOf(RestoreNotificationUseCase);
    });

    it('should have execute method', () => {
      const useCase = makeRestoreNotificationUseCase();
      expect(useCase.execute).toBeDefined();
    });

    it('should return a new instance each time it is called', () => {
      const useCase1 = makeRestoreNotificationUseCase();
      const useCase2 = makeRestoreNotificationUseCase();
      expect(useCase1).not.toBe(useCase2);
    });
  });
});
