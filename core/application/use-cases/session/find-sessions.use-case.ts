import { SessionRepository } from '@/core/domain/repositories/session.repository';
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
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(input: FindSessionsInput): Promise<FindSessionsOutput> {
    const { items, total } = await this.sessionRepository.findAll({
      ...input,
    });

    return {
      items: items.map((s) => ({
        id: s.id,
        userId: s.userId,
        ipAddress: s.ipAddress,
        userAgent: s.userAgent,
        issuedAt: s.issuedAt,
        expiresAt: s.expiresAt,
        deletedAt: s.deletedAt ?? null,
      })),
      total,
    };
  }
}
