import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import {
  RestoreNotificationInput,
  RestoreNotificationOutput,
} from '../../contracts/notification/restore-notification.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to restore a soft-deleted notification.
 */
export class RestoreNotificationUseCase implements UseCase<
  RestoreNotificationInput,
  RestoreNotificationOutput
> {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: RestoreNotificationInput
  ): Promise<RestoreNotificationOutput> {
    const { id, restoredBy, ipAddress, userAgent } = input;

    // 1. Check if the notification exists (including deleted).
    const notification = await this.notificationRepository.findById(id, true);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (notification.deletedAt) {
      await this.notificationRepository.restore(id);
    }

    const restoredNotification = (await this.notificationRepository.findById(
      id
    )) as RestoreNotificationOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: restoredBy || 'SYSTEM',
      action: 'RESTORE',
      entityName: 'NOTIFICATION',
      entityId: id,
      newValues: restoredNotification,
      ipAddress,
      userAgent,
    });

    return restoredNotification;
  }
}
