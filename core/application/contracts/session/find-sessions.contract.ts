import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for finding active or historical sessions. */
export interface FindSessionsInput {
  /** Number of records to skip for pagination. */
  skip?: number;
  /** Number of records to take for pagination. */
  take?: number;
  /** Field to order the results by. */
  orderBy?: string;
  /** Order direction (ascending or descending). */
  orderDir?: 'asc' | 'desc';
  /** Start date filter for session issuance. */
  startDate?: string;
  /** End date filter for session issuance. */
  endDate?: string;
  /** Timezone offset for date calculations. */
  timezoneOffset?: string;
  /** Search term for filtering results. */
  search?: string;
  /** Filter sessions by a specific user ID. */
  userId?: string;
  /** Whether to include related user data in the response. */
  includeRelatedUsers?: boolean;
  /** Whether to include deleted (revoked) sessions. */
  includeDeleted?: boolean;
}

/** Output of the find sessions operation. */
export interface FindSessionsOutput {
  /** List of formatted session items. */
  items: Array<{
    /** Unique session identifier. */
    id: string;
    /** ID of the session owner. */
    userId: string;
    /** IP address of the user. */
    ipAddress?: string | null;
    /** User agent of the client. */
    userAgent?: string | null;
    /** Timestamp of session issuance. */
    issuedAt: Date;
    /** Timestamp of session expiration. */
    expiresAt: Date;
    /** Timestamp of session revocation. */
    deletedAt: Date | null;
  }>;
  /** Total count of sessions matching criteria. */
  total: number;
  /** Optional list of related users. */
  relatedUsers?: User[];
}
