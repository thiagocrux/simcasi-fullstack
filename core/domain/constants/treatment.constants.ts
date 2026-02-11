/**
 * Fields of the Treatment entity that are allowed for sorting in list requests.
 */
export const TREATMENT_SORTABLE_FIELDS = [
  'id',
  'patientId',
  'medication',
  'healthCenter',
  'startDate',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the Treatment entity that are allowed for text search.
 * Focuses on medication names, health units (Unidades de Saúde), and partner follow-up.
 */
export const TREATMENT_SEARCHABLE_FIELDS = [
  'medication',
  'healthCenter',
  'dosage',
  'observations',
  'partnerInformation',
] as const;
