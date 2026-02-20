import { Patient } from '@/core/domain/entities/patient.entity';
import { Treatment } from '@/core/domain/entities/treatment.entity';
import { User } from '@/core/domain/entities/user.entity';

/**
 * Input parameters for searching and filtering treatments.
 */
export interface FindTreatmentsInput {
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
  /** Whether to include related users in the result. */
  includeRelatedUsers?: boolean;
  /** Whether to include related patients in the result. */
  includeRelatedPatients?: boolean;
  /** Whether to include deleted treatments. */
  includeDeleted?: boolean;
}

/**
 * Output of the treatment search operation.
 */
export interface FindTreatmentsOutput {
  /** List of treatments found. */
  items: Treatment[];
  /** Total number of treatments matching the filter. */
  total: number;
  /** Related users, if requested. */
  relatedUsers?: User[];
  /** Related patients, if requested. */
  relatedPatients?: Patient[];
}
