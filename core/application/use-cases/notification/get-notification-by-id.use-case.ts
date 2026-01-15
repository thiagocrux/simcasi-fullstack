import { NotFoundError } from '@/core/domain/errors/app.error';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import {
  GetNotificationByIdInput,
  GetNotificationByIdOutput,
} from '../../contracts/notification/get-notification-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a notification by ID.
 */
export class GetNotificationByIdUseCase implements UseCase<
  GetNotificationByIdInput,
  GetNotificationByIdOutput
> {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: GetNotificationByIdInput
  ): Promise<GetNotificationByIdOutput> {
    // 1. Find the notification by ID.
    const notification = await this.notificationRepository.findById(input.id);
    if (!notification) {
      throw new NotFoundError('Notification not found');
    }

    return notification;
  }
}
