import { Patient } from '@/core/domain/entities/patient.entity';

/** Input parameters for updating a patient. */
export interface UpdatePatientInput {
  /** The unique identifier of the patient. */
  id: string;
  /** SUS card number. */
  susCardNumber?: string;
  /** Full name of the patient. */
  name?: string;
  /** CPF number. */
  cpf?: string;
  /** Preferred social name. */
  socialName?: string;
  /** Date of birth. */
  birthDate?: Date | string;
  /** Patient's race category. */
  race?: string;
  /** Biological sex. */
  sex?: string;
  /** Gender identity. */
  gender?: string;
  /** Sexual orientation. */
  sexuality?: string;
  /** Nationality. */
  nationality?: string;
  /** Education level. */
  schooling?: string;
  /** Professional occupation. */
  profession?: string;
  /** Contact phone number. */
  phoneNumber?: string;
  /** Contact email address. */
  email?: string;
  /** Mother's full name. */
  motherName?: string;
  /** Father's full name. */
  fatherName?: string;
  /** Address street name. */
  address?: string;
  /** Residential house number. */
  addressNumber?: string;
  /** Address neighborhood. */
  addressNeighborhood?: string;
  /** Address city. */
  addressCity?: string;
  /** Address state. */
  addressState?: string;
  /** Address zip code. */
  addressZipCode?: string;
  /** Additional address details. */
  complement?: string;
}

/** Output of the update patient operation. */
export interface UpdatePatientOutput extends Patient {}
