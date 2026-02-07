import { User } from '@/core/domain/entities/user.entity';
import { NotificationRepository } from '@/core/domain/repositories/notification.repository';
import { PatientRepository } from '@/core/domain/repositories/patient.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
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
    private readonly notificationRepository: NotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly patientRepository: PatientRepository
  ) {}

  async execute(
    input: FindNotificationsInput
  ): Promise<FindNotificationsOutput> {
    const { items, total } = await this.notificationRepository.findAll(input);

    // Extract unique user and patient IDs if requested
    const userIds = new Set<string>();
    const patientIds = new Set<string>();

    items.forEach((item) => {
      if (input.includeRelatedUsers) {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      }
      if (input.includeRelatedPatients) {
        if (item.patientId) patientIds.add(item.patientId);
      }
    });

    const [relatedUsers, relatedPatients] = await Promise.all([
      userIds.size > 0
        ? this.userRepository.findByIds(Array.from(userIds))
        : Promise.resolve([]),
      patientIds.size > 0
        ? this.patientRepository.findByIds(Array.from(patientIds))
        : Promise.resolve([]),
    ]);

    // Sanitize users
    const sanitizedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    return {
      items,
      total,
      ...(input.includeRelatedUsers && { relatedUsers: sanitizedUsers }),
      ...(input.includeRelatedPatients && { relatedPatients }),
    };
  }
}
