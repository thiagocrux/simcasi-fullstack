import { Session } from '@/core/domain/entities/session.entity';

/**
 * Input parameters for retrieving a session by ID.
 */
export interface GetSessionByIdInput {
  /** Unique identifier of the session to retrieve. */
  id: string;
  /** Whether to include deleted/invalidated sessions. */
  includeDeleted?: boolean;
}

/**
 * Output of the get session by ID operation.
 * Returns the session entity.
 */
export interface GetSessionByIdOutput extends Session {}
