import { Patient } from '@/core/domain/entities/patient.entity';
import { AuditMetadata } from '../common/audit-metadata.contract';

export interface UpdatePatientInput extends AuditMetadata {
  id: string;
  susCardNumber?: string;
  name?: string;
  cpf?: string;
  socialName?: string;
  birthDate?: Date | string;
  race?: string;
  sex?: string;
  gender?: string;
  sexuality?: string;
  nationality?: string;
  schooling?: string;
  profession?: string;
  phoneNumber?: string;
  email?: string;
  motherName?: string;
  fatherName?: string;
  address?: string;
  addressNumber?: string;
  addressNeighborhood?: string;
  addressCity?: string;
  addressState?: string;
  addressZipCode?: string;
  complement?: string;
}

export interface UpdatePatientOutput extends Patient {}
