'use client';

import { ClipboardCopyButton } from '../../common/ClipboardCopyButton';

interface Field {
  label: string;
  value: string | number | boolean | null | undefined;
}

interface PreviewDialogContentProps {
  fields: Field[];
}

/**
 * Renders a standardized list of fields for preview dialogs.
 * Each field displays a label, separator line, and copy button for the value.
 *
 * @param fields - Array of field objects containing label and value pairs.
 */
export function PreviewDialogContent({ fields }: PreviewDialogContentProps) {
  return (
    <div className="flex flex-col gap-0.5 overflow-hidden text-sm">
      {fields.map((field) => (
        <div
          key={`${field.label}-${field.value}`}
          className="flex sm:flex-row flex-col items-start sm:items-center"
        >
          <p className="text-muted-foreground">{field.label}</p>
          <div className="flex-1 mx-2 border-b border-dashed" />
          {field.value && (
            <ClipboardCopyButton value={String(field.value)} variant="label" />
          )}
        </div>
      ))}
    </div>
  );
}
