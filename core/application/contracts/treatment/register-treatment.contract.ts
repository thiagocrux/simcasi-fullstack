import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface RegisterTreatmentInput {
  patientId: string;
  medication: string;
  healthCenter: string;
  startDate: Date | string;
  dosage: string;
  observations?: string | null;
  partnerInformation?: string | null;
}

export type RegisterTreatmentOutput = Treatment;
