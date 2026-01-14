import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface RegisterTreatmentInput {
  patientId: string;
  medication: string;
  healthCenter: string;
  startDate: Date;
  dosage: string;
  observations?: string | null;
  partnerInformation?: string | null;
  createdBy: string;
}

export type RegisterTreatmentOutput = Treatment;
