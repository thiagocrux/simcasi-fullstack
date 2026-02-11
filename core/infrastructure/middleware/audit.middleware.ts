import {
  RegisterAuditLogInput,
  RegisterAuditLogOutput,
} from '@/core/application/contracts/audit-log/register-audit-log.contract';
import { makeRegisterAuditLogUseCase } from '../factories/audit-log.factory';

/**
 * Persists an audit log entry using the application use case.
 *
 * This function follows the same Input/Output pattern for consistency across the
 * infrastructure layer.
 *
 * @param input The data required to register the audit log.
 * @return A promise that resolves with the result of the registration.
 */
export async function auditAction(
  input: RegisterAuditLogInput
): Promise<RegisterAuditLogOutput> {
  const useCase = makeRegisterAuditLogUseCase();

  return await useCase.execute(input);
}
