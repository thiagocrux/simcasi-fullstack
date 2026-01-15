import { NotFoundError } from '@/core/domain/errors/app.error';
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
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: UpdateNotificationInput
  ): Promise<UpdateNotificationOutput> {
    const { id, ...data } = input;

    // 1. Check if the notification exists.
    const notification = await this.notificationRepository.findById(id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    // 2. Update the notification.
    return this.notificationRepository.update(id, data);
  }
}
