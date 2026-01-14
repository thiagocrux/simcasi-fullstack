import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface GetTreatmentByIdInput {
  id: string;
}

export type GetTreatmentByIdOutput = Treatment;
