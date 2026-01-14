import { Exam } from '@/core/domain/entities/exam.entity';

export interface UpdateExamInput {
  id: string;
  treponemalTestType?: string;
  treponemalTestResult?: string;
  treponemalTestDate?: Date;
  treponemalTestLocation?: string;
  nontreponemalVdrlTest?: string;
  nontreponemalTestTitration?: string;
  nontreponemalTestDate?: Date;
  otherNontreponemalTest?: string | null;
  otherNontreponemalTestDate?: Date | null;
  referenceObservations?: string;
}

export type UpdateExamOutput = Exam;
