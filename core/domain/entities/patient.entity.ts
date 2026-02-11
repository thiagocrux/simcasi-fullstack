/**
 * Represents a patient in the SIMCASI system.
 * Contains identifiers, demographic information, and contact details according to SUS standards.
 */
export interface Patient {
  /** Unique identifier for the patient. */
  id: string;
  /** SUS card number. */
  susCardNumber: string;
  /** Full Legal Name. */
  name: string;
  /** Individual taxpayer registry number (CPF). */
  cpf: string;
  /** Name by which the person identifies and is recognized socially. */
  socialName?: string | null;
  /** Date of birth. */
  birthDate: Date;
  /** Ethnic-racial classification */
  race: string;
  /** Biological sex. */
  sex: string;
  /** Gender identity. */
  gender: string;
  /** Sexual orientation. */
  sexuality: string;
  /** Country of origin. */
  nationality: string;
  /** Educational level. */
  schooling: string;
  /** Contact phone number. */
  phone?: string | null;
  /** Contact email address. */
  email?: string | null;
  /** Full name of the mother. */
  motherName: string;
  /** Full name of the father. */
  fatherName?: string | null;
  /** Flag indicating if the patient is deceased. */
  isDeceased: boolean;
  /** Strategy for patient follow-up and monitoring. */
  monitoringType: string;
  /** Postal code for address. */
  zipCode?: string | null;
  /** State (UF - Unidade Federativa). */
  state: string;
  /** City where the patient resides. */
  city: string;
  /** Neighborhood or district. */
  neighborhood: string;
  /** Street name. */
  street: string;
  /** House or building number. */
  houseNumber: string;
  /** Additional address info (apartment, block, etc.). */
  complement?: string | null;
  /** Identifier of the user who registered the patient. */
  createdBy: string;
  /** Timestamp of registration. */
  createdAt: Date;
  /** Identifier of the user who last updated the record. */
  updatedBy?: string | null;
  /** Timestamp of the last update. */
  updatedAt?: Date | null;
  /** Timestamp of soft deletion. */
  deletedAt?: Date | null;
}
