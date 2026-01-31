/**
 * Formats a Date object to a string in 'pt-BR' locale with short date and medium time, using the 'America/Recife' timezone.
 *
 * @param {Date} date The date to format.
 * @return {string|null} The formatted date string, or null if input is invalid.
 */
export function formatDate(date: Date) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
    timeZone: 'America/Recife',
  }).format(date);
}

export type MaskType = 'cpf' | 'susCardNumber' | 'phone' | 'zipCode';

/**
 * Applies a mask to a string value according to the specified MaskType.
 *
 * @param {string} value The value to be masked (should contain only digits for best results).
 * @param {MaskType} type The type of mask to apply.
 * @return {string} The masked string, or the original value if the type is not recognized or input is invalid.
 */
export function applyMask(value: string, type: MaskType): string {
  const onlyNumbers = value.replace(/\D+/g, '');

  switch (type) {
    case 'cpf':
      return onlyNumbers
        .replace(/^(\d{3})(\d{3})(\d{3})(\d{2}).*/, '$1.$2.$3-$4')
        .slice(0, 14);
    case 'susCardNumber':
      return onlyNumbers
        .replace(/^(\d{3})(\d{4})(\d{4})(\d{4}).*/, '$1 $2 $3 $4')
        .slice(0, 19);
    case 'phone':
      if (onlyNumbers.length === 11) {
        // (XX) 9XXXX-XXXX (mobile phone)
        return `+55 (${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 7)}-${onlyNumbers.slice(7, 11)}`;
      } else if (onlyNumbers.length === 10) {
        // (XX) XXXX-XXXX (telephone)
        return `+55 (${onlyNumbers.slice(0, 2)}) ${onlyNumbers.slice(2, 6)}-${onlyNumbers.slice(6, 10)}`;
      }
      return value;
    case 'zipCode':
      return onlyNumbers.replace(/^(\d{5})(\d{3}).*/, '$1-$2').slice(0, 9);
    default:
      return value;
  }
}
