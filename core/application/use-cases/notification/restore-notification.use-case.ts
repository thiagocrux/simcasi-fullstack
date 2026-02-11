import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
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
  /**
   * Initializes a new instance of the RestoreNotificationUseCase class.
   *
   * @param notificationRepository The repository for notification persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to restore a soft-deleted notification.
   *
   * @param input The data containing the notification ID and auditor info.
   * @return A promise that resolves to the restored notification.
   * @throws {NotFoundError} If the notification is not found.
   */
  async execute(
    input: RestoreNotificationInput
  ): Promise<RestoreNotificationOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the notification exists (including deleted).
    const notification = await this.notificationRepository.findById(id, true);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (notification.deletedAt) {
      await this.notificationRepository.restore(
        id,
        userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
      );
    }

    const restoredNotification = (await this.notificationRepository.findById(
      id
    )) as RestoreNotificationOutput;

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
