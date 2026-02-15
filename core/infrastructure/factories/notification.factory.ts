import { DeleteNotificationUseCase } from '@/core/application/use-cases/notification/delete-notification.use-case';
import { FindNotificationsUseCase } from '@/core/application/use-cases/notification/find-notifications.use-case';
import { GetNotificationByIdUseCase } from '@/core/application/use-cases/notification/get-notification-by-id.use-case';
import { RegisterNotificationUseCase } from '@/core/application/use-cases/notification/register-notification.use-case';
import { RestoreNotificationUseCase } from '@/core/application/use-cases/notification/restore-notification.use-case';
import { UpdateNotificationUseCase } from '@/core/application/use-cases/notification/update-notification.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaNotificationRepository } from '../repositories/prisma/notification.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';
import { PrismaUserRepository } from '../repositories/prisma/user.prisma.repository';

const notificationRepository = new PrismaNotificationRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();
const userRepository = new PrismaUserRepository();

/**
 * Factory function to create an instance of RegisterNotificationUseCase.
 * Injects repositories for notifications, patients, and audit logging.
 * @return A fully initialized RegisterNotificationUseCase.
 */
export function makeRegisterNotificationUseCase() {
  return new RegisterNotificationUseCase(
    notificationRepository,
    patientRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of FindNotificationsUseCase.
 * Injects repositories for notifications, users, and patients.
 * @return A fully initialized FindNotificationsUseCase.
 */
export function makeFindNotificationsUseCase() {
  return new FindNotificationsUseCase(
    notificationRepository,
    userRepository,
    patientRepository
  );
}

/**
 * Factory function to create an instance of GetNotificationByIdUseCase.
 * @return A fully initialized GetNotificationByIdUseCase.
 */
export function makeGetNotificationByIdUseCase() {
  return new GetNotificationByIdUseCase(notificationRepository);
}

/**
 * Factory function to create an instance of UpdateNotificationUseCase.
 * @return A fully initialized UpdateNotificationUseCase.
 */
export function makeUpdateNotificationUseCase() {
  return new UpdateNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of DeleteNotificationUseCase.
 * @return A fully initialized DeleteNotificationUseCase.
 */
export function makeDeleteNotificationUseCase() {
  return new DeleteNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}

/**
 * Factory function to create an instance of RestoreNotificationUseCase.
 * @return A fully initialized RestoreNotificationUseCase.
 */
export function makeRestoreNotificationUseCase() {
  return new RestoreNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}
