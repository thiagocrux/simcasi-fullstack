import { Treatment } from '@/core/domain/entities/treatment.entity';

export interface RegisterTreatmentInput {
  patientId: string;
  medication: string;
  healthCenter: string;
  startDate: Date;
  dosage: string;
  observations?: string | null;
  partnerInformation?: string | null;
  createdBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export type RegisterTreatmentOutput = Treatment;
