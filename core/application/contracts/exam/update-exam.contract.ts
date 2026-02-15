import { Exam } from '@/core/domain/entities/exam.entity';

export interface UpdateExamInput {
  id: string;
  treponemalTestType?: string;
  treponemalTestResult?: string;
  treponemalTestDate?: Date | string;
  treponemalTestLocation?: string;
  nontreponemalVdrlTest?: string;
  nontreponemalTestTitration?: string;
  nontreponemalTestDate?: Date | string;
  otherNontreponemalTest?: string | null;
  otherNontreponemalTestDate?: Date | string | null;
  referenceObservations?: string;
}

export type UpdateExamOutput = Exam;
