import { AuditLogRepository } from '@/core/domain/repositories/audit-log.repository';
import {
  RegisterAuditLogInput,
  RegisterAuditLogOutput,
} from '../../contracts/audit-log/register-audit-log.contract';
import { UseCase } from '../use-case.interface';

export class RegisterAuditLogUseCase implements UseCase<
  RegisterAuditLogInput,
  RegisterAuditLogOutput
> {
  constructor(private readonly auditLogRepository: AuditLogRepository) {}

  async execute(input: RegisterAuditLogInput): Promise<RegisterAuditLogOutput> {
    return this.auditLogRepository.create(input);
  }
}
