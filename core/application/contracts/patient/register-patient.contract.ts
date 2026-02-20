import { Patient } from '@/core/domain/entities/patient.entity';

/** Input parameters for registering a patient. */
export interface RegisterPatientInput {
  /** SUS card number. */
  susCardNumber: string;
  /** Full name of the patient. */
  name: string;
  /** CPF number. */
  cpf: string;
  /** Preferred social name. */
  socialName?: string;
  /** Date of birth. */
  birthDate: Date | string;
  /** Patient's race category. */
  race: string;
  /** Biological sex. */
  sex: string;
  /** Gender identity. */
  gender: string;
  /** Sexual orientation. */
  sexuality: string;
  /** Nationality. */
  nationality: string;
  /** Education level. */
  schooling: string;
  /** Contact phone number. */
  phone?: string;
  /** Contact email address. */
  email?: string;
  /** Mother's full name. */
  motherName: string;
  /** Father's full name. */
  fatherName?: string;
  /** Deceased status indicator. */
  isDeceased: boolean;
  /** Kind of monitoring applied to the case. */
  monitoringType: string;
  /** Address zip code. */
  zipCode?: string;
  /** Address state. */
  state: string;
  /** Address city. */
  city: string;
  /** Address neighborhood. */
  neighborhood: string;
  /** Address street name. */
  street: string;
  /** Residential house number. */
  houseNumber: string;
  /** Additional address details. */
  complement?: string;
}

/** Output of the register patient operation. */
export interface RegisterPatientOutput extends Patient {}
