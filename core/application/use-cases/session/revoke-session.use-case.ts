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
  constructor(
    private readonly sessionRepository: SessionRepository,
    private readonly auditLogRepository: AuditLogRepository
  ) {}

  async execute(input: RevokeSessionInput): Promise<RevokeSessionOutput> {
    const { id, revokedBy, ipAddress, userAgent } = input;
    const session = await this.sessionRepository.findById(id);

    if (!session) {
      throw new NotFoundError('Session not found.');
    }

    await this.sessionRepository.softDelete(id);

    // Create audit log.
    await this.auditLogRepository.create({
      userId: revokedBy || 'SYSTEM',
      action: 'REVOKE_SESSION',
      entityName: 'SESSION',
      entityId: id,
      oldValues: session,
      ipAddress,
      userAgent,
    });

    return { success: true };
  }
}
