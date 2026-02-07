import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindPatientsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  search?: string;
  searchBy?: string;
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  includeRelatedUsers?: boolean;
  includeDeleted?: boolean;
}

export interface FindPatientsOutput {
  items: Patient[];
  total: number;
  relatedUsers?: User[];
}
