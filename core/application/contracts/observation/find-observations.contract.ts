import { Observation } from '@/core/domain/entities/observation.entity';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

/**
 * Input parameters for searching and filtering observations.
 */
export interface FindObservationsInput {
  /** Number of records to skip (for pagination). */
  skip?: number;
  /** Number of records to take (for pagination). */
  take?: number;
  /** Field to order by. */
  orderBy?: string;
  /** Order direction: ascending or descending. */
  orderDir?: 'asc' | 'desc';
  /** Search term for filtering. */
  search?: string;
  /** Field to search by. */
  searchBy?: string;
  /** Start date for filtering. */
  startDate?: string;
  /** End date for filtering. */
  endDate?: string;
  /** Timezone offset for date filtering. */
  timezoneOffset?: string;
  /** Filter by patient ID. */
  patientId?: string;
  /** Whether to include related patients in the result. */
  includeRelatedPatients?: boolean;
  /** Whether to include related users in the result. */
  includeRelatedUsers?: boolean;
  /** Whether to include deleted observations. */
  includeDeleted?: boolean;
}

/**
 * Output of the observation search operation.
 */
export interface FindObservationsOutput {
  /** List of observations found. */
  items: Observation[];
  /** Total number of observations matching the filter. */
  total: number;
  /** Related patients, if requested. */
  relatedPatients?: Patient[];
  /** Related users, if requested. */
  relatedUsers?: User[];
}
