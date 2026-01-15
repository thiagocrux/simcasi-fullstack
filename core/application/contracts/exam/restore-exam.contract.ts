import { Exam } from '@/core/domain/entities/exam.entity';

import { AuditMetadata } from '../common/audit-metadata.contract';

export interface RestoreExamInput extends AuditMetadata {
  id: string;
}

export type RestoreExamOutput = Exam;
