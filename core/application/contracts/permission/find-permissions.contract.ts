import { Permission } from '@/core/domain/entities/permission.entity';
import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for finding permissions. */
export interface FindPermissionsInput {
  /** Number of records to skip for pagination. */
  skip?: number;
  /** Number of records to take for pagination. */
  take?: number;
  /** Field to order the results by. */
  orderBy?: string;
  /** Order direction (ascending or descending). */
  orderDir?: 'asc' | 'desc';
  /** Search term for filtering permissions. */
  search?: string;
  /** Property used as criteria for the search. */
  searchBy?: string;
  /** Start date filter for creation. */
  startDate?: string;
  /** End date filter for creation. */
  endDate?: string;
  /** Timezone offset for date calculations. */
  timezoneOffset?: string;
  /** Whether to include related user data in the response. */
  includeRelatedUsers?: boolean;
  /** Whether to include soft-deleted records. */
  includeDeleted?: boolean;
}

/** Output of the find permissions operation. */
export interface FindPermissionsOutput {
  /** The list of permissions found. */
  items: Permission[];
  /** Total number of permissions matching the criteria. */
  total: number;
  /** Optional list of related users. */
  relatedUsers?: User[];
}
