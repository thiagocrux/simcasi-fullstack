import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface RestoreTreatmentInput {
  id: string;
}

export type RestoreTreatmentOutput = Treatment;
