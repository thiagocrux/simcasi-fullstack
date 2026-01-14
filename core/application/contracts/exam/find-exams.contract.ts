import { Exam } from '@/core/domain/entities/exam.entity';

export interface FindExamsInput {
  skip?: number;
  take?: number;
  search?: string;
  patientId?: string;
  includeDeleted?: boolean;
}

export interface FindExamsOutput {
  items: Exam[];
  total: number;
}
