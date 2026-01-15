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
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(input: GetAuditLogByIdInput): Promise<GetAuditLogByIdOutput> {
    // 1. Find the audit log by ID.
    const auditLog = await this.auditLogRepository.findById(input.id);
    if (!auditLog) {
      throw new NotFoundError('Audit Log not found');
    }

    return auditLog;
  }
}
