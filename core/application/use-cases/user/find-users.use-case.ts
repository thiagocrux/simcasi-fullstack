import { userQuerySchema } from '@/core/application/validation/schemas/user.schema';
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
  /**
   * Creates an instance of FindUsersUseCase.
   * @param userRepository The repository for user data operations.
   */
  constructor(private readonly userRepository: UserRepository) {}

  /**
   * Executes the use case to find users.
   * @param input The search criteria and pagination params.
   * @return A promise that resolves to the list of users and total count.
   */
  async execute(input: FindUsersInput): Promise<FindUsersOutput> {
    const validatedInput = userQuerySchema.parse(input) as FindUsersInput;

    const result = await this.userRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    if (validatedInput.includeRelatedUsers) {
      result.items.forEach((item) => {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      });
    }

    // Fetch and sanitize related users if requested
    const relatedUsers =
      userIds.size > 0
        ? await this.userRepository.findByIds(Array.from(userIds))
        : [];

    const sanitizedRelatedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    return {
      total: result.total,
      items: result.items.map((user) => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      }),
      ...(validatedInput.includeRelatedUsers && {
        relatedUsers: sanitizedRelatedUsers,
      }),
    };
  }
}
