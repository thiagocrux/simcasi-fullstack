import { Exam } from '@/core/domain/entities/exam.entity';

export interface RegisterExamInput {
  patientId: string;
  treponemalTestType: string;
  treponemalTestResult: string;
  treponemalTestDate: Date;
  treponemalTestLocation: string;
  nontreponemalVdrlTest: string;
  nontreponemalTestTitration: string;
  nontreponemalTestDate: Date;
  otherNontreponemalTest?: string | null;
  otherNontreponemalTestDate?: Date | null;
  referenceObservations: string;
  createdBy: string;
}

export type RegisterExamOutput = Exam;
