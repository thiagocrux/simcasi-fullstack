import { Exam } from '@/core/domain/entities/exam.entity';

export interface FindExamsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: Date;
  endDate?: Date;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindExamsOutput {
  items: Exam[];
  total: number;
}
