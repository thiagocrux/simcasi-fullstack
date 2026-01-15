import { NotFoundError } from '@/core/domain/errors/app.error';
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
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: DeleteNotificationInput
  ): Promise<DeleteNotificationOutput> {
    // 1. Check if the notification exists.
    const notification = await this.notificationRepository.findById(input.id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Soft delete the notification.
    await this.notificationRepository.softDelete(input.id);
  }
}
