import { NotFoundError } from '@/core/domain/errors/app.error';
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
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: RestoreNotificationInput
  ): Promise<RestoreNotificationOutput> {
    // 1. Check if the notification exists (including deleted).
    const notification = await this.notificationRepository.findById(
      input.id,
      true
    );
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Perform the restoration if it was deleted.
    if (notification.deletedAt) {
      await this.notificationRepository.restore(input.id);
    }

    return (await this.notificationRepository.findById(
      input.id
    )) as RestoreNotificationOutput;
  }
}
