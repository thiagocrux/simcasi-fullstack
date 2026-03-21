import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RevokeAllSessionsInput,
  RevokeAllSessionsOutput,
} from '../../contracts/session/revoke-all-sessions.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to revoke all active sessions belonging to a specific user.
 */
export class RevokeAllSessionsUseCase implements UseCase<
  RevokeAllSessionsInput,
  RevokeAllSessionsOutput
> {
  /**
   * Initializes a new instance of the RevokeAllSessionsUseCase class.
   *
   * @param sessionRepository The repository for session persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to revoke all sessions for a given user.
   *
   * @param input The data containing the target user ID.
   * @return A promise that resolves when all sessions are revoked.
   */
  async execute(
    input: RevokeAllSessionsInput
  ): Promise<RevokeAllSessionsOutput> {
    const { userId } = input;
    const { userId: actorId, ipAddress, userAgent } = getRequestContext();

    await this.sessionRepository.revokeAllByUserId(userId);

    // Create audit log.
    await this.auditLogRepository.create({
      userId: actorId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: AUDIT_LOG_ACTION.REVOKE_SESSION,
      entityName: AUDIT_LOG_ENTITY.SESSION,
      entityId: userId,
      ipAddress,
      userAgent,
    });

    return { success: true };
  }
}
