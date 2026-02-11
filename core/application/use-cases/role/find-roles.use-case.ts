import { roleQuerySchema } from '@/core/application/validation/schemas/role.schema';
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
  /**
   * Initializes a new instance of the FindRolesUseCase class.
   *
   * @param roleRepository The repository for role persistence.
   * @param userRepository The repository for user details.
   */
  constructor(
    private readonly roleRepository: RoleRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Executes the use case to find roles.
   *
   * @param input The query parameters for finding roles.
   * @return A promise that resolves to the paginated roles and related data.
   */
  async execute(input: FindRolesInput): Promise<FindRolesOutput> {
    const validatedInput = roleQuerySchema.parse(input) as FindRolesInput;

    const { items, total } = await this.roleRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    if (validatedInput.includeRelatedUsers) {
      items.forEach((item: Role) => {
        if (item.createdBy) userIds.add(item.createdBy);
        if (item.updatedBy) userIds.add(item.updatedBy);
      });
    }

    // Fetch and sanitize related users if requested
    const relatedUsers =
      userIds.size > 0
        ? await this.userRepository.findByIds(Array.from(userIds))
        : [];

    const sanitizedUsers = relatedUsers.map((user) => {
      const { password: _, ...rest } = user;
      return rest;
    }) as Omit<User, 'password'>[];

    return {
      items,
      total,
      ...(validatedInput.includeRelatedUsers && {
        relatedUsers: sanitizedUsers,
      }),
    };
  }
}
