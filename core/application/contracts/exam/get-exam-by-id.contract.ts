import { Exam } from '@/core/domain/entities/exam.entity';

export interface GetExamByIdInput {
  id: string;
}

export type GetExamByIdOutput = Exam;
