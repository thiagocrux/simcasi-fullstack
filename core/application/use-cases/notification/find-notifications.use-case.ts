import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import {
  FindNotificationsInput,
  FindNotificationsOutput,
} from '../../contracts/notification/find-notifications.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find notifications with pagination and filters.
 */
export class FindNotificationsUseCase implements UseCase<
  FindNotificationsInput,
  FindNotificationsOutput
> {
  constructor(
    private readonly notificationRepository: NotificationRepository
  ) {}

  async execute(
    input: FindNotificationsInput
  ): Promise<FindNotificationsOutput> {
    // 1. Find all notifications based on input criteria.
    return this.notificationRepository.findAll(input);
  }
}
