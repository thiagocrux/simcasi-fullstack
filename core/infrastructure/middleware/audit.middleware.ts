import {
  RegisterAuditLogInput,
  RegisterAuditLogOutput,
} from '@/core/application/contracts/audit-log/register-audit-log.contract';
import { makeRegisterAuditLogUseCase } from '../factories/audit-log.factory';

/**
 * Persists an audit log entry using the application use case.
 * Following the same Input/Output pattern for consistency.
 */
export async function auditAction(
  input: RegisterAuditLogInput
): Promise<RegisterAuditLogOutput> {
  const useCase = makeRegisterAuditLogUseCase();

  return await useCase.execute(input);
}
