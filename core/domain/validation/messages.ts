export const messages = {
  REQUIRED_FIELD: (field: string) =>
    `O campo **${field.toLowerCase()}** é obrigatório.`,
  INVALID_FIELD: (field: string) =>
    `O campo **${field.toLowerCase()}** é inválido.`,
  REQUIRED_MIN_LENGTH: (field: string, min: number) =>
    `O campo **${field.toLowerCase()}** deve ter no máximo ${min} caracteres.`,
  REQUIRED_MAX_LENGTH: (field: string, max: number) =>
    `O campo **${field.toLowerCase()}** deve ter no máximo ${max} caracteres.`,

  INVALID_PASSWORD:
    'A senha deve ter entre 8 e 128 caracteres, incluindo pelo menos uma letra minúscula, uma maiúscula, um número, um símbolo e pode conter espaços.',
  INVALID_PHONE:
    'Por favor, insira um telefone no seguinte formato: +XX (XX) 9XXXX-XXXX.',
} as const;
