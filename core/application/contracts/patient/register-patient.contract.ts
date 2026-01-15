import { Patient } from '@/core/domain/entities/patient.entity';

export interface RegisterPatientInput {
  susCardNumber: string;
  name: string;
  cpf: string;
  socialName?: string;
  birthDate: Date;
  race: string;
  sex: string;
  gender: string;
  sexuality: string;
  nationality: string;
  schooling: string;
  phone?: string;
  email?: string;
  motherName: string;
  fatherName?: string;
  isDeceased: boolean;
  monitoringType: string;
  zipCode?: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  houseNumber: string;
  complement?: string;
  createdBy?: string;
  // Audit metadata (optional, can be populated by the caller)
  ipAddress?: string;
  userAgent?: string;
}

export interface RegisterPatientOutput extends Patient {}
