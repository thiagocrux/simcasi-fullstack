/**
 * Fields of the Exam entity that are allowed for sorting in list requests.
 */
export const EXAM_SORTABLE_FIELDS = [
  'id',
  'patientId',
  'treponemalTestType',
  'treponemalTestResult',
  'treponemalTestDate',
  'nontreponemalTestDate',
  'createdAt',
  'updatedAt',
  'deletedAt',
] as const;

/**
 * Fields of the Exam entity that are allowed for text search.
 * Includes technical test types and clinical locations.
 */
export const EXAM_SEARCHABLE_FIELDS = [
  'treponemalTestType',
  'treponemalTestLocation',
  'nontreponemalTestTitration',
  'referenceObservations',
] as const;
