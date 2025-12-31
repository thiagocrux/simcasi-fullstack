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
