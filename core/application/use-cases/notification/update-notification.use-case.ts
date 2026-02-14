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
  /**
   * Initializes a new instance of the UpdateNotificationUseCase class.
   *
   * @param notificationRepository The repository for notification persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to update an existing notification.
   *
   * @param input The data to update the notification.
   * @return A promise that resolves to the updated notification.
   * @throws {ValidationError} If the input data is invalid.
   * @throws {NotFoundError} If the notification is not found.
   */
  async execute(
    input: UpdateNotificationInput
  ): Promise<UpdateNotificationOutput> {
    const { id, userId, ipAddress, userAgent, ...data } = input;

    // 1. Validate input.
    const validation = notificationSchema.partial().safeParse(data);
    if (!validation.success) {
      throw new ValidationError(
        'Dados de atualização de notificação inválidos.',
        formatZodError(validation.error)
      );
    }

    // 2. Check if the notification exists.
    const existing = await this.notificationRepository.findById(id);
    if (!existing) {
      throw new NotFoundError('Notificação');
    }

    // 3. Update the notification.
    const updatedNotification = await this.notificationRepository.update(
      id,
      {
        ...data,
      },
      userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID
    );

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
