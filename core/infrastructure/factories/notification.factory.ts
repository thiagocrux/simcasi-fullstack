import { DeleteNotificationUseCase } from '@/core/application/use-cases/notification/delete-notification.use-case';
import { FindNotificationsUseCase } from '@/core/application/use-cases/notification/find-notifications.use-case';
import { GetNotificationByIdUseCase } from '@/core/application/use-cases/notification/get-notification-by-id.use-case';
import { RegisterNotificationUseCase } from '@/core/application/use-cases/notification/register-notification.use-case';
import { RestoreNotificationUseCase } from '@/core/application/use-cases/notification/restore-notification.use-case';
import { UpdateNotificationUseCase } from '@/core/application/use-cases/notification/update-notification.use-case';
import { PrismaAuditLogRepository } from '../repositories/prisma/audit-log.prisma.repository';
import { PrismaNotificationRepository } from '../repositories/prisma/notification.prisma.repository';
import { PrismaPatientRepository } from '../repositories/prisma/patient.prisma.repository';

const notificationRepository = new PrismaNotificationRepository();
const patientRepository = new PrismaPatientRepository();
const auditLogRepository = new PrismaAuditLogRepository();

export function makeRegisterNotificationUseCase() {
  return new RegisterNotificationUseCase(
    notificationRepository,
    patientRepository,
    auditLogRepository
  );
}

export function makeFindNotificationsUseCase() {
  return new FindNotificationsUseCase(notificationRepository);
}

export function makeGetNotificationByIdUseCase() {
  return new GetNotificationByIdUseCase(notificationRepository);
}

export function makeUpdateNotificationUseCase() {
  return new UpdateNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}

export function makeDeleteNotificationUseCase() {
  return new DeleteNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}

export function makeRestoreNotificationUseCase() {
  return new RestoreNotificationUseCase(
    notificationRepository,
    auditLogRepository
  );
}
