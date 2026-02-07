import { Role } from '@/core/domain/entities/role.entity';
import { User } from '@/core/domain/entities/user.entity';
import { RoleRepository } from '@/core/domain/repositories/role.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindRolesInput,
  FindRolesOutput,
} from '../../contracts/role/find-roles.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find roles with pagination and search.
 */
export class FindRolesUseCase implements UseCase<
  FindRolesInput,
  FindRolesOutput
> {
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: FindRolesInput): Promise<FindRolesOutput> {
    const { items, total } = await this.roleRepository.findAll(input);

    // Extract unique user IDs if requested
    const userIds = new Set<string>();
    if (input.includeRelatedUsers) {
      items.forEach((item: Role) => {
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
