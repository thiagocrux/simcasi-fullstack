/**
 * Fields of the Patient entity that are allowed for sorting in list requests.
 */
export const PATIENT_SORTABLE_FIELDS = [
  'id',
  'susCardNumber',
  'name',
  'cpf',
  'socialName',
  'birthDate',
  'createdAt',
  'updatedAt',
  'motherName',
] as const;

/**
 * Fields of the Patient entity that are allowed for text search.
 */
export const PATIENT_SEARCHABLE_FIELDS = [
  'name',
  'cpf',
  'susCardNumber',
  'socialName',
  'motherName',
] as const;

/**
 * List of gender identity options for patient registration.
 */
export const GENDER_OPTIONS = [
  { label: 'Feminino', value: 'Feminino' },
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Não binário', value: 'Não binário' },
  { label: 'Não declarado', value: 'Não declarado' },
];

/**
 * List of nationality options for patient registration.
 */
export const NATIONALITY_OPTIONS = [
  { label: 'Brasileira', value: 'Brasileira' },
  { label: 'Estrangeira', value: 'Estrangeira' },
];

/**
 * List of race/ethnicity options for patient registration.
 */
export const RACE_OPTIONS = [
  { label: 'Branca', value: 'Branca' },
  { label: 'Preta', value: 'Preta' },
  { label: 'Parda', value: 'Parda' },
  { label: 'Amarela', value: 'Amarela' },
  { label: 'Indígena', value: 'Indígena' },
  { label: 'Não declarado', value: 'Não declarado' },
];

/**
 * List of biological sex options for patient registration.
 */
export const SEX_OPTIONS = [
  { label: 'Feminino', value: 'Feminino' },
  { label: 'Masculino', value: 'Masculino' },
  { label: 'Intersexo', value: 'Intersexo' },
  { label: 'Não declarado', value: 'Não declarado' },
];

/**
 * List of sexual orientation options for patient registration.
 */
export const SEXUALITY_OPTIONS = [
  { label: 'Heterossexual', value: 'Heterossexual' },
  { label: 'Homossexual', value: 'Homossexual' },
  { label: 'Bissexual', value: 'Bissexual' },
  { label: 'Assexual', value: 'Assexual' },
  { label: 'Pansexual', value: 'Pansexual' },
  { label: 'Não declarado', value: 'Não declarado' },
];

/**
 * List of education/schooling level options for patient registration.
 */
export const SCHOOLING_OPTIONS = [
  { label: 'Analfabeto', value: 'Analfabeto' },
  { label: 'Fundamental incompleto', value: 'Fundamental incompleto' },
  { label: 'Fundamental completo', value: 'Fundamental completo' },
  { label: 'Médio incompleto', value: 'Médio incompleto' },
  { label: 'Médio completo', value: 'Médio completo' },
  { label: 'Superior incompleto', value: 'Superior incompleto' },
  { label: 'Superior completo', value: 'Superior completo' },
  { label: 'Pós-graduação', value: 'Pós-graduação' },
  { label: 'Mestrado', value: 'Mestrado' },
  { label: 'Doutorado', value: 'Doutorado' },
  { label: 'Não declarado', value: 'Não declarado' },
];
