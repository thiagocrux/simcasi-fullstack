import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
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
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(input: FindAuditLogsInput): Promise<FindAuditLogsOutput> {
    // 1. Find all audit logs based on input criteria.
    return this.auditLogRepository.findAll(input);
  }
}
