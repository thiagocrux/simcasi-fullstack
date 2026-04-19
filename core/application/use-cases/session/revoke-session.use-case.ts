import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { ForbiddenError, NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import { getRequestContext } from '@/core/infrastructure/lib/request-context';
import {
  RevokeSessionInput,
  RevokeSessionOutput,
} from '../../contracts/session/revoke-session.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to administratively revoke a session.
 */
export class RevokeSessionUseCase implements UseCase<
  RevokeSessionInput,
  RevokeSessionOutput
> {
  /**
   * Initializes a new instance of the RevokeSessionUseCase class.
   *
   * @param sessionRepository The repository for session persistence.
   * @param auditLogRepository The repository for audit logging.
   */
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  /**
   * Executes the use case to revoke a session.
   *
   * @param input The data containing the session ID.
   * @return A promise that resolves when the session is revoked.
   * @throws {NotFoundError} If the session is not found.
   * @throws {ForbiddenError} If the user is not an admin/health professional and attempts to revoke someone else's session.
   */
  async execute(input: RevokeSessionInput): Promise<RevokeSessionOutput> {
    const { id } = input;
    const { userId: executorId, ipAddress, userAgent } = getRequestContext();
    const existingSession = await this.sessionRepository.findById(id);

    if (!existingSession) {
      throw new NotFoundError('Sessão');
    }

    // Authorization check: Admin OR Health Professional OR own session.
    const context = getRequestContext();
    const isAdmin = context.roleCode === 'admin';
    const isHealthProfessional = context.roleCode === 'user';
    const isOwnSession = existingSession.userId === executorId;

    if (!isAdmin && !isHealthProfessional && !isOwnSession) {
      throw new ForbiddenError(
        'You do not have permission to terminate sessions for other users.'
      );
    }

    await this.sessionRepository.softDelete(id);

    // Create audit log.
    await this.auditLogRepository.create({
      userId: executorId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: AUDIT_LOG_ACTION.REVOKE_SESSION,
      entityName: AUDIT_LOG_ENTITY.SESSION,
      entityId: id,
      oldValues: JSON.parse(JSON.stringify(existingSession)),
      ipAddress,
      userAgent,
    });

    return { success: true };
  }
}
