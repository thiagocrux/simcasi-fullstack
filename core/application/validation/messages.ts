import { SINAN_LENGTH } from '@/core/domain/constants/notification.constants';

export const messages = {
  REQUIRED_FIELD: (field: string) => `O campo **${field}** é obrigatório.`,
  INVALID_FIELD: (field: string) => `O campo **${field}** é inválido.`,
  REQUIRED_EXACT_LENGTH: (field: string, min: number, displayValue?: number) =>
    `O campo **${field}** deve ter exatamente ${displayValue ?? min} caracteres.`,
  REQUIRED_MIN_LENGTH: (field: string, min: number, displayValue?: number) =>
    `O campo **${field}** deve ter no mínimo ${displayValue ?? min} caracteres.`,
  REQUIRED_MAX_LENGTH: (field: string, max: number, displayValue?: number) =>
    `O campo **${field}** deve ter no máximo ${displayValue ?? max} caracteres.`,
  INVALID_PASSWORD:
    'A senha deve ter entre 8 e 128 caracteres, incluindo pelo menos uma letra minúscula, uma maiúscula, um número, um símbolo e pode conter espaços.',
  UNMATCHED_PASSWORDS:
    'As senhas não coincidem. Verifique se você digitou a mesma senha nos dois campos.',
  SAME_PASSWORD: 'A nova senha não pode ser igual à senha atual.',
  INVALID_PHONE:
    'Por favor, insira um telefone em um dos seguintes formatos: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX.',
  INVALID_UUID:
    'Formato incorreto. Este campo requer um UUID válido (exemplo: 550e8400-e29b-41d4-a716-446655440000).',
  INVALID_CREDENTIALS: 'Credenciais inválidas. Por favor, tente novamente.',
  INVALID_SINAN: `O campo **SINAN** deve ter exatamente ${SINAN_LENGTH} dígitos. Caso o número possua menos de ${SINAN_LENGTH}, complete com zeros à esquerda.`,
} as const;
