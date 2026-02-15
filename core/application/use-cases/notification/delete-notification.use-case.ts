import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  DeleteNotificationInput,
  DeleteNotificationOutput,
} from '../../contracts/notification/delete-notification.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to soft delete a notification.
 */
export class DeleteNotificationUseCase implements UseCase<
  DeleteNotificationInput,
  DeleteNotificationOutput
> {
  /**
   * Initializes a new instance of the DeleteNotificationUseCase class.
   *
   * @param notificationRepository The repository for notification persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to soft delete a notification.
   *
   * @param input The data containing the notification ID.
   * @return A promise that resolves when the deletion is complete.
   * @throws {NotFoundError} If the notification is not found.
   */
  async execute(
    input: DeleteNotificationInput
  ): Promise<DeleteNotificationOutput> {
    const { userId, ipAddress, userAgent } = getRequestContext();
    const { id } = input;

    // 1. Check if the notification exists.
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notificação');
    }

    // 2. Soft delete the notification.
    await this.notificationRepository.softDelete(
      id,
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: 'DELETE',
      entityName: 'NOTIFICATION',
      entityId: id,
      oldValues: existing,
      ipAddress,
      userAgent,
    });
  }
}
