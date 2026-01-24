export const messages = {
  REQUIRED_FIELD: (field: string) => `O campo **${field}** é obrigatório.`,
  INVALID_FIELD: (field: string) => `O campo **${field}** é inválido.`,
  REQUIRED_MIN_LENGTH: (field: string, min: number) =>
    `O campo **${field}** deve ter no máximo ${min} caracteres.`,
  REQUIRED_MAX_LENGTH: (field: string, max: number) =>
    `O campo **${field}** deve ter no máximo ${max} caracteres.`,

  INVALID_PASSWORD:
    'A senha deve ter entre 8 e 128 caracteres, incluindo pelo menos uma letra minúscula, uma maiúscula, um número, um símbolo e pode conter espaços.',
  UNMATCHED_PASSWORDS:
    'As senhas não coincidem. Verifique se você digitou a mesma senha nos dois campos.',
  INVALID_PHONE:
    'Por favor, insira um telefone no seguinte formato: +XX (XX) 9XXXX-XXXX.',
  INVALID_UUID:
    'Por favor, insira um UUID válido no formato: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx.',
  INVALID_CREDENTIALS: 'Credenciais inválidas. Por favor, tente novamente.',
} as const;
