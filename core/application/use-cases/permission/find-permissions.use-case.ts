import { Permission } from '@/core/domain/entities/permission.entity';
import { User } from '@/core/domain/entities/user.entity';
import { PermissionRepository } from '@/core/domain/repositories/permission.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindPermissionsInput,
  FindPermissionsOutput,
} from '../../contracts/permission/find-permissions.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find permissions with pagination and search.
 */
export class FindPermissionsUseCase implements UseCase<
  FindPermissionsInput,
  FindPermissionsOutput
> {
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: FindPermissionsInput): Promise<FindPermissionsOutput> {
    const { items, total } = await this.permissionRepository.findAll(input);

    // Extract unique user IDs from createdBy and updatedBy if requested
    const userIds = new Set<string>();
    if (input.includeRelatedUsers) {
      items.forEach((item: Permission) => {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      });
    }

    const relatedUsers =
      userIds.size > 0
        ? await this.userRepository.findByIds(Array.from(userIds))
        : [];

    // Sanitize users
    const sanitizedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    return {
      items,
      total,
      ...(input.includeRelatedUsers && { relatedUsers: sanitizedUsers }),
    };
  }
}
