import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for finding patients. */
export interface FindPatientsInput {
  /** Number of records to skip for pagination. */
  skip?: number;
  /** Number of records to take for pagination. */
  take?: number;
  /** Field to order the results by. */
  orderBy?: string;
  /** Order direction (ascending or descending). */
  orderDir?: 'asc' | 'desc';
  /** Search term for filtering patients. */
  search?: string;
  /** Property used as criteria for the search. */
  searchBy?: string;
  /** Start date filter for patient creation. */
  startDate?: string;
  /** End date filter for patient creation. */
  endDate?: string;
  /** Timezone offset for date calculations. */
  timezoneOffset?: string;
  /** Whether to include related user data in the response. */
  includeRelatedUsers?: boolean;
  /** Whether to include soft-deleted records. */
  includeDeleted?: boolean;
}

/** Output of the find patients operation. */
export interface FindPatientsOutput {
  /** The list of patients found. */
  items: Patient[];
  /** Total number of patients matching the criteria. */
  total: number;
  /** Optional list of related users. */
  relatedUsers?: User[];
}
