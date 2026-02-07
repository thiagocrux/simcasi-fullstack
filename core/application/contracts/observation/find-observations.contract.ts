import { Observation } from '@/core/domain/entities/observation.entity';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindObservationsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  patientId?: string;
  includeRelatedPatients?: boolean;
  includeRelatedUsers?: boolean;
  includeDeleted?: boolean;
}

export interface FindObservationsOutput {
  items: Observation[];
  total: number;
  relatedPatients?: Patient[];
  relatedUsers?: User[];
}
