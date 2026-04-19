import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { ForbiddenError } from '@/core/domain/errors/app.error';
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
   * @throws {ForbiddenError} If the user is not an admin/health professional and attempts to revoke sessions for a different user.
   */
  async execute(
    input: RevokeAllSessionsInput
  ): Promise<RevokeAllSessionsOutput> {
    const { userId } = input;
    const { userId: actorId, ipAddress, userAgent } = getRequestContext();

    // Authorization check: Admin OR Health Professional OR own sessions.
    const context = getRequestContext();
    const isAdmin = context.roleCode === 'admin';
    const isHealthProfessional = context.roleCode === 'user';
    const isOwnAccount = userId === actorId;

    if (!isAdmin && !isHealthProfessional && !isOwnAccount) {
      throw new ForbiddenError(
        'You do not have permission to terminate sessions for other users.'
      );
    }

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
