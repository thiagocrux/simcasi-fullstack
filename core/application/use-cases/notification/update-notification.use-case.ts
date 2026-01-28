import { notificationSchema } from '@/core/application/validation/schemas/notification.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
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
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = notificationSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Invalid update notification data.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the notification exists.
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notification not found');
    }

    // 3. Update the notification.
    const updatedNotification = await this.notificationRepository.update(id, {
      ...data,
      updatedBy: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
    });

    // 4. Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
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
