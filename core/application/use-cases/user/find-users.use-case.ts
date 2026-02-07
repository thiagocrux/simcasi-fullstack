import { User } from '@/core/domain/entities/user.entity';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindUsersInput,
  FindUsersOutput,
} from '../../contracts/user/find-users.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find users with pagination and search.
 */
export class FindUsersUseCase implements UseCase<
  FindUsersInput,
  FindUsersOutput
> {
  constructor(private readonly userRepository: UserRepository) {}

  async execute(input: FindUsersInput): Promise<FindUsersOutput> {
    // 1. Find all users based on input criteria.
    const result = await this.userRepository.findAll(input);

    // Extract unique user IDs from createdBy and updatedBy if requested
    const userIds = new Set<string>();
    if (input.includeRelatedUsers) {
      result.items.forEach((item) => {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      });
    }

    const relatedUsers =
      userIds.size > 0
        ? await this.userRepository.findByIds(Array.from(userIds))
        : [];

    // Sanitize related users
    const sanitizedRelatedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    // 2. Security: Ensure passwords are removed from the output.
    return {
      total: result.total,
      items: result.items.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      ...(input.includeRelatedUsers && { relatedUsers: sanitizedRelatedUsers }),
    };
  }
}
