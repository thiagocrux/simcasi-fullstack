import { Exam } from '@/core/domain/entities/exam.entity';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';

export interface FindExamsInput {
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

export interface FindExamsOutput {
  items: Exam[];
  total: number;
  relatedPatients?: Patient[];
  relatedUsers?: User[];
}
