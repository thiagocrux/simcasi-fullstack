import { Exam } from '@/core/domain/entities/exam.entity';

export interface RestoreExamInput {
  id: string;
}

export type RestoreExamOutput = Exam;
