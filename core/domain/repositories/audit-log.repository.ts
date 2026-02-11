import { AuditLog } from '../entities/audit-log.entity';

/**
 * Repository interface for the AuditLog entity.
 * Audit logs are read-only and follow an immutability pattern.
 */
export interface AuditLogRepository {
  /**
   * Finds a specific audit log by its ID.
   *
   * @param id The audit log ID.
   * @return The found audit log or null.
   */
  findById(id: string): Promise<AuditLog | null>;

  /**
   * Lists all audit logs with pagination and filtering support.
   * Useful for administrative and audit views.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of logs and the total count.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    search?: string;
    searchBy?: string;
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    userId?: string;
    action?: string;
    entityName?: string;
    entityId?: string;
  }): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Creates a new audit log entry.
   *
   * @param data Data for audit log creation.
   * @return The created audit log.
   */
  create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
}
