/**
 * Formats a Date object or ISO string to a string in 'pt-BR' locale.
 * Uses the user's local timezone (browser default).
 *
 * @param {Date | string | null | undefined} date The date to format.
 * @return {string|null} The formatted date string, or null if input is invalid.
 */
export function formatDate(date: Date | string | null | undefined) {
  if (!date) {
    return null;
  }

  const validatedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(validatedDate.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(validatedDate);
}

/**
 * Formats a Date object or ISO string to a calendar date string (dd/mm/aaaa) without time.
 * This function uses UTC to ensure the date doesn't shift regardless of user timezone.
 * Useful for birth dates, exam dates, etc.
 *
 * @param {Date | string | undefined | null} date The date to format.
 * @return {string} The formatted date string, or '—' if input is invalid.
 */
export function formatCalendarDate(date: Date | string | undefined | null) {
  if (!date) {
    return '—';
  }

  const validatedDate = date instanceof Date ? date : new Date(date);

  if (isNaN(validatedDate.getTime())) {
    return '—';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeZone: 'UTC',
  }).format(validatedDate);
}

/**
 * Returns a 'yyyy-MM-dd' string from a date, using UTC components
 * to avoid timezone shifts. Useful for pre-filling HTML form date inputs.
 *
 * @param {Date | string | undefined | null} date The date to be formatted.
 * @returns {string} A string in the format 'yyyy-MM-dd'.
 */
export function toCalendarISOString(
  date: Date | string | undefined | null
): string {
  if (!date) return '';

  const d = date instanceof Date ? date : new Date(date);
  if (isNaN(d.getTime())) return '';

  const day = d.getUTCDate().toString().padStart(2, '0');
  const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const year = d.getUTCFullYear();

  return `${year}-${month}-${day}`;
}

export type MaskType = 'cpf' | 'susCardNumber' | 'phone' | 'zipCode' | 'sinan';

/**
 * Applies a mask to a string value according to the specified MaskType.
 *
 * @param {string} value The value to be masked (should contain only digits for best results).
 * @param {MaskType} type The type of mask to apply.
 * @return {string} The masked string, or the original value if the type is not recognized or input is invalid.
 */
export function applyMask(
  value: string,
  type: Omit<MaskType, 'sinan'>
): string {
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
