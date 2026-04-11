'use client';

import { Card } from '../ui/card';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import { ClipboardCopyButton } from './ClipboardCopyButton';

type Section = {
  title?: string;
  fields: {
    label: string;
    value: string | null | undefined;
  }[];
};

interface DetailsPagePropertiesProps {
  data: Section[];
  changeLog?: { label: string; value: string | null }[] | null;
}

export function DetailsPageProperties({
  data,
  changeLog = null,
}: DetailsPagePropertiesProps) {
  return (
    <>
      <Card className="flex flex-col gap-8 px-8 py-12 text-sm">
        {data.map((section, index) => (
          <div
            key={`${section.title}-${index}`}
            className="flex flex-col gap-4"
          >
            {section.title && (
              <div className="flex flex-col gap-2">
                <Label>{section.title}</Label>
                <Separator />
              </div>
            )}

            <div className="flex flex-col gap-0.5 overflow-hidden">
              {section.fields.map((field) => (
                <div
                  key={`${field.label}-${field.value}`}
                  className="flex sm:flex-row flex-col items-start sm:items-center"
                >
                  <p className="text-muted-foreground">{field.label}</p>
                  <div className="flex-1 mx-2 border-b border-dashed" />
                  {field.value && (
                    <ClipboardCopyButton value={field.value} variant="label" />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </Card>

      {changeLog ? (
        <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
          {changeLog.map((field) => (
            <div key={field.label} className="flex flex-col gap-4">
              <div className="flex items-center start">
                <h3 className="font-semibold text-lg">{field.label}</h3>
              </div>
              <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-auto">
                {field.value ? (
                  <div className="relative">
                    <pre className="font-mono text-sm break-all leading-relaxed whitespace-pre-wrap">
                      {field.value}
                    </pre>
                    <div className="-top-2 -right-2 absolute">
                      {field.value ? (
                        <ClipboardCopyButton
                          variant="icon"
                          label="Copiar dados"
                          value={field.value}
                        />
                      ) : null}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm">
                    Não há valores para serem mostrados.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </>
  );
}
