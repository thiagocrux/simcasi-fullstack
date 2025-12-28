'use client';

import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ClipboardCopyButton } from './ClipboardCopyButton';

interface DetailsPagePropertiesProps {
  data: Section[];
}

type Section = {
  title?: string;
  fields: {
    label: string;
    value: string | null | undefined;
  }[];
};

export function DetailsPageProperties({ data }: DetailsPagePropertiesProps) {
  return (
    <Card className="flex flex-col gap-8 px-8 py-12 text-sm">
      {data.map((section, index) => (
        <div key={section.title ?? index} className="flex flex-col gap-4">
          {section.title && (
            <div className="flex flex-col gap-2">
              <Label>{section.title}</Label>
              <Separator />
            </div>
          )}

          <div className="flex flex-col gap-0.5 overflow-hidden">
            {section.fields.map((field) => (
              <div
                key={field.value}
                className="flex sm:flex-row flex-col items-start sm:items-center"
              >
                <p className="text-muted-foreground">{field.label}</p>
                <div className="flex-1 mx-2 border-b border-dashed" />
                {field.value && (
                  <ClipboardCopyButton text={field.value} variant="label" />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </Card>
  );
}
