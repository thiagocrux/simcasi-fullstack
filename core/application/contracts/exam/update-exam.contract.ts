import { Exam } from '@/core/domain/entities/exam.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdateExamInput extends AuditMetadata {
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
