import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import {
  RegisterAuditLogInput,
  RegisterAuditLogOutput,
} from '../../contracts/audit-log/register-audit-log.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to register a new audit log.
 */
export class RegisterAuditLogUseCase implements UseCase<
  RegisterAuditLogInput,
  RegisterAuditLogOutput
> {
  /**
   * Initializes a new instance of the RegisterAuditLogUseCase class.
   *
   * @param auditLogRepository The repository for audit log persistence.
   */
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  /**
   * Executes the use case to register an audit log.
   *
   * @param input The data for the new audit log.
   * @return A promise that resolves to the registered audit log.
   */
  async execute(input: RegisterAuditLogInput): Promise<RegisterAuditLogOutput> {
    return this.auditLogRepository.create(input);
  }
}
