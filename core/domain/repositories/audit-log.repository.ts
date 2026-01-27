import { AuditLog } from '../entities/audit-log.entity';

/**
 * Repository interface for AuditLog entity.
 * Audit logs are append-only and follow an immutability pattern.
 */
export interface AuditLogRepository {
  /**
   * Searches for a specific audit log by ID.
   */
  findById(id: string): Promise<AuditLog | null>;

  /**
   * Lists all audit logs with support for pagination and filtering.
   * Useful for administrative and auditing views.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    startDate?: Date;
    endDate?: Date;
    search?: string;
    userId?: string;
    action?: string;
    entityName?: string;
    entityId?: string;
  }): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Creates a new audit log entry.
   */
  create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
}
