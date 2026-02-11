import { auditLogQuerySchema } from '@/core/application/validation/schemas/audit-log.schema';
import { User } from '@/core/domain/entities/user.entity';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindAuditLogsInput,
  FindAuditLogsOutput,
} from '../../contracts/audit-log/find-audit-logs.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to find audit logs with pagination and filters.
 */
export class FindAuditLogsUseCase implements UseCase<
  FindAuditLogsInput,
  FindAuditLogsOutput
> {
  /**
   * Initializes a new instance of the FindAuditLogsUseCase class.
   *
   * @param auditLogRepository The repository for audit log persistence.
   * @param userRepository The repository for user data.
   */
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Executes the use case to find audit logs.
   *
   * @param input The query parameters for finding audit logs.
   * @return A promise that resolves to the paginated audit logs and related users.
   */
  async execute(input: FindAuditLogsInput): Promise<FindAuditLogsOutput> {
    const validatedInput = auditLogQuerySchema.parse(
      input
    ) as FindAuditLogsInput;

    const { items, total } =
      await this.auditLogRepository.findAll(validatedInput);

    const userIds = new Set<string>();
    if (validatedInput.includeRelatedUsers) {
      items.forEach((item) => {
        if (item.userId) userIds.add(item.userId);
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
