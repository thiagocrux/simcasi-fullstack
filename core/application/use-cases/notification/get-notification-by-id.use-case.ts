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
  /**
   * Initializes a new instance of the GetNotificationByIdUseCase class.
   *
   * @param notificationRepository The repository for notification persistence.
   */
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  /**
   * Executes the use case to get a notification by its ID.
   *
   * @param input The data containing the notification ID.
   * @return A promise that resolves to the found notification.
   * @throws {NotFoundError} If the notification is not found.
   */
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
