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
   * Retrieves all audit logs related to a specific entity (e.g., 'Patient', 'User').
   */
  findByEntity(
    entityName: string,
    entityId: string,
    params?: { skip?: number; take?: number }
  ): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Retrieves all audit logs triggered by a specific user.
   */
  findByUserId(
    userId: string,
    params?: { skip?: number; take?: number }
  ): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Retrieves all audit logs for a specific action (e.g., 'DELETE', 'LOGIN').
   */
  findByAction(
    action: string,
    params?: { skip?: number; take?: number }
  ): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Lists all audit logs with support for pagination.
   * Useful for administrative and auditing views.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
  }): Promise<{ items: AuditLog[]; total: number }>;

  /**
   * Creates a new audit log entry.
   */
  create(data: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
}
