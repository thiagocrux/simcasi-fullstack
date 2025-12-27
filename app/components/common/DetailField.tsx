import { ClipboardCopyButton } from './ClipboardCopyButton';

interface DetailFieldProps {
  label: string;
  value: string;
}

export function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div className="flex sm:flex-row flex-col items-start sm:items-center">
      <p className="text-muted-foreground">{label}</p>
      <div className="flex-1 mx-2 border-b border-dashed" />
      <ClipboardCopyButton text={value} variant="label" />
    </div>
  );
}
