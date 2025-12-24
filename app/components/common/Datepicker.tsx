'use client';

import { isValid, parse, parseISO } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

interface DatepickerProps {
  /* Accept Date or ISO / yyyy-MM-dd strings */
  value?: Date | string | undefined;
  onValueChange: (date: string | undefined) => void;
  placeholder: string;
  hasError?: boolean;
}

function parseDate(value?: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;

  // try ISO first
  try {
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
  } catch {
    // ignore
  }

  // try yyyy-MM-dd (common input format)
  try {
    const d = parse(String(value), 'yyyy-MM-dd', new Date());
    if (isValid(d)) return d;
  } catch {
    // ignore
  }

  return undefined;
}

export function Datepicker({
  value,
  onValueChange,
  placeholder = 'Selecione uma data',
  hasError = false,
}: DatepickerProps) {
  const [open, setOpen] = React.useState(false);

  const [date, setDate] = React.useState<Date | undefined>(() =>
    parseDate(value)
  );

  // Keep internal state in sync if parent passes a new value
  React.useEffect(() => {
    setDate(parseDate(value));
  }, [value]);

  return (
    <div className="flex flex-col gap-3">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id="date"
            aria-invalid={hasError}
            className={cn(
              'justify-between w-full font-normal',
              hasError && 'border-destructive! focus:ring-destructive/30!',
              !date && 'text-muted-foreground hover:text-muted-foreground'
            )}
          >
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={(date) => {
              setDate(date);
              setOpen(false);
              onValueChange(date ? date.toISOString() : undefined);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
