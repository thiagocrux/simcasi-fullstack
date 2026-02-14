import {
  AUDIT_LOG_ACTION,
  AUDIT_LOG_ENTITY,
} from '@/core/domain/constants/audit-log.constants';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
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
   * @param input The data containing the session ID and auditor info.
   * @return A promise that resolves when the session is revoked.
   * @throws {NotFoundError} If the session is not found.
   */
  async execute(input: RevokeSessionInput): Promise<RevokeSessionOutput> {
    const { id, userId, ipAddress, userAgent } = input;
    const session = await this.sessionRepository.findById(id);

    if (!session) {
      throw new NotFoundError('Sessão');
    }

    await this.sessionRepository.softDelete(id);

    // Create audit log.
    await this.auditLogRepository.create({
      userId: userId ?? SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
      action: AUDIT_LOG_ACTION.REVOKE_SESSION,
      entityName: AUDIT_LOG_ENTITY.SESSION,
      entityId: id,
      oldValues: session,
      ipAddress,
      userAgent,
    });

    return { success: true };
  }
}
