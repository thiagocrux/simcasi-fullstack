import { Role } from '@/core/domain/entities/role.entity';
import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for finding roles. */
export interface FindRolesInput {
  /** Number of records to skip for pagination. */
  skip?: number;
  /** Number of records to take for pagination. */
  take?: number;
  /** Field to order the results by. */
  orderBy?: string;
  /** Order direction (ascending or descending). */
  orderDir?: 'asc' | 'desc';
  /** Search term to filter roles. */
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

/** Output of the find roles operation. */
export interface FindRolesOutput {
  /** List of roles found. */
  items: Role[];
  /** Total count of roles matching filters. */
  total: number;
  /** Optional list of related users. */
  relatedUsers?: User[];
}
