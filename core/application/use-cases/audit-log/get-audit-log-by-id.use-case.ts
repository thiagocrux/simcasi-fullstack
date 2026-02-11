import { NotFoundError } from '@/core/domain/errors/app.error';
import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import {
  GetAuditLogByIdInput,
  GetAuditLogByIdOutput,
} from '../../contracts/audit-log/get-audit-log-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve an audit log by ID.
 */
export class GetAuditLogByIdUseCase implements UseCase<
  GetAuditLogByIdInput,
  GetAuditLogByIdOutput
> {
  /**
   * Initializes a new instance of the GetAuditLogByIdUseCase class.
   *
   * @param auditLogRepository The repository for audit log persistence.
   */
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  /**
   * Executes the use case to get an audit log by its ID.
   *
   * @param input The data containing the audit log ID.
   * @return A promise that resolves to the found audit log.
   * @throws {NotFoundError} If the audit log is not found.
   */
  async execute(input: GetAuditLogByIdInput): Promise<GetAuditLogByIdOutput> {
    // 1. Find the audit log by ID.
    const auditLog = await this.auditLogRepository.findById(input.id);
    if (!auditLog) {
      throw new NotFoundError('Audit Log not found');
    }

    return auditLog;
  }
}
