/**
 * Fields of the Observation entity that are allowed for sorting in list requests.
 */
export const OBSERVATION_SORTABLE_FIELDS = [
  'id',
  'patientId',
  'hasPartnerBeingTreated',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the Observation entity that are allowed for text search.
 * Targets clinical follow-up notes and monitoring observations.
 */
export const OBSERVATION_SEARCHABLE_FIELDS = ['observations'] as const;
