import { AuditLog } from '@/core/domain/entities/audit-log.entity';

/** Input parameters for getting an audit log by ID. */
export interface GetAuditLogByIdInput {
  /** The unique identifier of the audit log. */
  id: string;
}

/** Output of the get audit log by ID operation. */
export type GetAuditLogByIdOutput = AuditLog;
