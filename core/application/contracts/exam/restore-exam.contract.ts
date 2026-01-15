import { Exam } from '@/core/domain/entities/exam.entity';

export interface RestoreExamInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RestoreExamOutput = Exam;
