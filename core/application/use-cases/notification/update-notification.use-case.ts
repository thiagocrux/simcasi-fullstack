import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import {
  UpdateNotificationInput,
  UpdateNotificationOutput,
} from '../../contracts/notification/update-notification.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to update an existing notification.
 */
export class UpdateNotificationUseCase implements UseCase<
  UpdateNotificationInput,
  UpdateNotificationOutput
> {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(
    input: UpdateNotificationInput
  ): Promise<UpdateNotificationOutput> {
    const { id, updatedBy, ipAddress, userAgent, ...data } = input;

    // 1. Check if the notification exists.
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Update the notification.
    const updatedNotification = await this.notificationRepository.update(
      id,
      data
    );

    // 3. Create audit log.
    await this.auditLogRepository.create({
      userId: updatedBy || 'SYSTEM',
      action: 'UPDATE',
      entityName: 'NOTIFICATION',
      entityId: id,
      oldValues: existing,
      newValues: updatedNotification,
      ipAddress,
      userAgent,
    });

    return updatedNotification;
  }
}
