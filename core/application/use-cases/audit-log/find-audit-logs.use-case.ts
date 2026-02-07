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
  constructor(
    private readonly auditLogRepository: AuditLogRepository,
    private readonly userRepository: UserRepository
  ) {}

  async execute(input: FindAuditLogsInput): Promise<FindAuditLogsOutput> {
    const { items, total } = await this.auditLogRepository.findAll(input);

    // Extract unique user IDs from userId if requested
    const userIds = new Set<string>();
    if (input.includeRelatedUsers) {
      items.forEach((item) => {
        if (item.userId) userIds.add(item.userId);
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
