import { Session } from '../entities/session.entity';

/**
 * Repository interface for Session entity.
 * Handles user login sessions and metadata.
 */
export interface SessionRepository {
  /**
   * Searches for a session by ID, including logically deleted ones if requested.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Session | null>;

  /**
   * Lists all sessions with support for pagination and filtering.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    search?: string;
    userId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Session[]; total: number }>;

  /**
   * Creates a new session record.
   */
  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Session>;

  /**
   * Executes Soft Delete (sets deletedAt). Usually used for logout.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Physically removes expired sessions from the database.
   */
  deleteExpired(): Promise<number>;
}
