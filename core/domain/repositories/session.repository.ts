import { Session } from '../entities/session.entity';

/**
 * Repository interface for the Session entity.
 * Manages user login sessions and metadata.
 */
export interface SessionRepository {
  /**
   * Finds a session by ID, including soft-deleted ones if requested.
   *
   * @param id The session ID.
   * @param includeDeleted Whether to include soft-deleted records.
   * @return The found session or null.
   */
  findById(id: string, includeDeleted?: boolean): Promise<Session | null>;

  /**
   * Lists all sessions with pagination and filtering support.
   *
   * @param params Pagination and filtering parameters.
   * @return An object containing the list of sessions and the total count.
   */
  findAll(params?: {
    skip?: number;
    take?: number;
    orderBy?: string;
    orderDir?: 'asc' | 'desc';
    startDate?: string;
    endDate?: string;
    timezoneOffset?: string;
    search?: string;
    userId?: string;
    includeDeleted?: boolean;
  }): Promise<{ items: Session[]; total: number }>;

  /**
   * Creates a new session record.
   *
   * @param data Data for session creation.
   * @return The created session.
   */
  create(
    data: Omit<Session, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>
  ): Promise<Session>;

  /**
   * Updates data of an existing session. Useful for updating expiration.
   *
   * @param id The session ID.
   * @param data Data for session update.
   * @return The updated session.
   */
  update(
    id: string,
    data: Partial<Omit<Session, 'id' | 'issuedAt' | 'createdAt'>>
  ): Promise<Session>;

  /**
   * Performs a soft delete. Generally used for logout.
   *
   * @param id The session ID.
   * @return A promise that resolves when the operation is complete.
   */
  softDelete(id: string): Promise<void>;

  /**
   * Revokes all active sessions for a specific user.
   *
   * @param userId The user ID.
   * @return A promise that resolves when the operation is complete.
   */
  revokeAllByUserId(userId: string): Promise<void>;

  /**
   * Revokes all active sessions for a specific user, except for one.
   *
   * @param sessionId The session ID to keep active.
   * @param userId The user ID.
   * @return A promise that resolves when the operation is complete.
   */
  revokeOtherSessions(sessionId: string, userId: string): Promise<void>;

  /**
   * Physically removes expired sessions from the database.
   *
   * @return The number of removed sessions.
   */
  deleteExpired(): Promise<number>;
}
