'use server';

import { FindAuditLogsOutput } from '@/core/application/contracts/audit-log/find-audit-logs.contract';
import { GetAuditLogByIdOutput } from '@/core/application/contracts/audit-log/get-audit-log-by-id.contract';
import {
  AuditLogQueryInput,
  auditLogQuerySchema,
} from '@/core/application/validation/schemas/audit-log.schema';
import { IdSchema } from '@/core/application/validation/schemas/common.schema';
import { formatZodError } from '@/core/application/validation/zod.utils';
import { ValidationError } from '@/core/domain/errors/app.error';
import {
  makeFindAuditLogsUseCase,
  makeGetAuditLogByIdUseCase,
} from '@/core/infrastructure/factories/audit-log.factory';
import {
  ActionResponse,
  withSecuredActionAndAutomaticRetry,
} from '@/lib/actions.utils';

/**
 * Retrieves a paginated list of audit log records with optional filtering.
 * @param query Optional filtering and pagination parameters.
 * @return A promise resolving to the list of audit logs and pagination metadata.
 */
export async function findAuditLogs(
  query?: AuditLogQueryInput
): Promise<ActionResponse<FindAuditLogsOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:audit-log'], async () => {
    const parsedData = auditLogQuerySchema.safeParse(query);
    const useCase = makeFindAuditLogsUseCase();
    return await useCase.execute(parsedData.data || {});
  });
}

/**
 * Retrieves a single audit log record by its unique identifier.
 * @param id The UUID of the audit log to retrieve.
 * @return A promise resolving to the audit log data.
 * @throws ValidationError If the provided ID is invalid.
 */
export async function getAuditLog(
  id: string
): Promise<ActionResponse<GetAuditLogByIdOutput>> {
  return withSecuredActionAndAutomaticRetry(['read:audit-log'], async () => {
    const parsedId = IdSchema.safeParse(id);
    if (!parsedId.success) {
      throw new ValidationError('ID inválido.', formatZodError(parsedId.error));
    }

    const useCase = makeGetAuditLogByIdUseCase();
    return await useCase.execute({ id: parsedId.data });
  });
}
