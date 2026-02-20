import { AuditLog } from '@/core/domain/entities/audit-log.entity';
import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for finding audit logs. */
export interface FindAuditLogsInput {
  /** Number of records to skip for pagination. */
  skip?: number;
  /** Number of records to take for pagination. */
  take?: number;
  /** Search term to filter results. */
  search?: string;
  /** Field to order the results by. */
  orderBy?: string;
  /** Order direction (ascending or descending). */
  orderDir?: 'asc' | 'desc';
  /** Start date filter in ISO format. */
  startDate?: string;
  /** End date filter in ISO format. */
  endDate?: string;
  /** Timezone offset for date calculations. */
  timezoneOffset?: string;
  /** Filter logs by a specific user. */
  userId?: string;
  /** Filter logs by action type. */
  action?: string;
  /** Filter logs by entity name. */
  entityName?: string;
  /** Filter logs by entity ID. */
  entityId?: string;
  /** Whether to include related user data in the response. */
  includeRelatedUsers?: boolean;
}

/** Output of the find audit logs operation. */
export interface FindAuditLogsOutput {
  /** The list of audit logs found. */
  items: AuditLog[];
  /** Total number of logs matching the criteria. */
  total: number;
  /** Optional list of related users. */
  relatedUsers?: User[];
}
