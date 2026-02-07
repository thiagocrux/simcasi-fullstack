import { Patient } from '@/core/domain/entities/patient.entity';
import { Treatment } from '@/core/domain/entities/treatment.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindTreatmentsInput {
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
  includeRelatedUsers?: boolean;
  includeRelatedPatients?: boolean;
  includeDeleted?: boolean;
}

export interface FindTreatmentsOutput {
  items: Treatment[];
  total: number;
  relatedUsers?: User[];
  relatedPatients?: Patient[];
}
