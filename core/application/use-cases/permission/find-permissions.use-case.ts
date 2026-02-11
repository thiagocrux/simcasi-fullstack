import { permissionQuerySchema } from '@/core/application/validation/schemas/permission.schema';
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
  /**
   * Initializes a new instance of the FindPermissionsUseCase class.
   *
   * @param permissionRepository The repository for permission persistence.
   * @param userRepository The repository for user details.
   */
  constructor(
    private readonly permissionRepository: PermissionRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Executes the use case to find permissions.
   *
   * @param input The query parameters for finding permissions.
   * @return A promise that resolves to the paginated permissions and related data.
   */
  async execute(input: FindPermissionsInput): Promise<FindPermissionsOutput> {
    const validatedInput = permissionQuerySchema.parse(
      input
    ) as FindPermissionsInput;

    const { items, total } =
      await this.permissionRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    if (validatedInput.includeRelatedUsers) {
      items.forEach((item: Permission) => {
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
