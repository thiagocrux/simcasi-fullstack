import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
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
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: DeleteNotificationInput
  ): Promise<DeleteNotificationOutput> {
    const { id, userId, ipAddress, userAgent } = input;

    // 1. Check if the notification exists.
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Soft delete the notification.
    await this.notificationRepository.softDelete(id);

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: userId || 'SYSTEM',
      action: 'DELETE',
      entityName: 'NOTIFICATION',
      entityId: id,
      oldValues: existing,
      ipAddress,
      userAgent,
    });
  }
}
