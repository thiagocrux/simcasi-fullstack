import { sessionQuerySchema } from '@/core/application/validation/schemas/session.schema';
import { User } from '@/core/domain/entities/user.entity';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { UserRepository } from '@/core/domain/repositories/user.repository';
import {
  FindSessionsInput,
  FindSessionsOutput,
} from '../../contracts/session/find-sessions.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to list and filter sessions.
 */
export class FindSessionsUseCase implements UseCase<
  FindSessionsInput,
  FindSessionsOutput
> {
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly userRepository: UserRepository
  ) {}

  /**
   * Executes the use case to find sessions.
   */
  async execute(input: FindSessionsInput): Promise<FindSessionsOutput> {
    const validatedInput = sessionQuerySchema.parse(input) as FindSessionsInput;

    const { items, total } =
      await this.sessionRepository.findAll(validatedInput);

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
      items: items.map((session) => ({
        id: session.id,
        userId: session.userId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        issuedAt: session.issuedAt,
        expiresAt: session.expiresAt,
        deletedAt: session.deletedAt ?? null,
      })),
      total,
      ...(validatedInput.includeRelatedUsers && {
        relatedUsers: sanitizedUsers,
      }),
    };
  }
}
