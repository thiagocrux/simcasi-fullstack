'use client';

import { format, isValid, parse, parseISO } from 'date-fns';
import { ChevronDownIcon } from 'lucide-react';
import * as React from 'react';

import { cn } from '@/lib/shared.utils';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';

/**
 * Props for the Datepicker component.
 */
interface DatepickerProps {
  placeholder?: string;
  hasError?: boolean;
  disabled?: boolean;
  value?: Date | string;
  onValueChange: (date: string | undefined) => void;
}

/**
 * Attempts to parse a value into a valid Date object.
 *
 * @param {Date|string|undefined} value The value to parse.
 * @return {Date|undefined} The parsed Date object or undefined.
 */
function parseDate(value?: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;

  try {
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
  } catch {
    // Ignore
  }

  try {
    const d = parse(String(value), 'yyyy-MM-dd', new Date());
    if (isValid(d)) return d;
  } catch {
    // Ignore
  }

  return undefined;
}

/**
 * Simplified Datepicker component for selecting a single date.
 */
export const Datepicker = React.forwardRef<HTMLButtonElement, DatepickerProps>(
  ({ placeholder = 'Selecione uma data', hasError = false, disabled, value, onValueChange }, ref) => {
    const [open, setOpen] = React.useState(false);

    const date = React.useMemo(() => parseDate(value), [value]);

    const handleSelect = (selectedDate: Date | undefined) => {
      setOpen(false);
      onValueChange(selectedDate ? format(selectedDate, 'yyyy-MM-dd') : undefined);
    };

    const displayValue = date ? format(date, 'dd/MM/yyyy') : placeholder;

    return (
      <div className="flex flex-col gap-3">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild disabled={disabled}>
            <Button
              ref={ref}
              variant="outline"
              id="date"
              aria-invalid={hasError}
              className={cn(
                'justify-between gap-2 w-full font-normal',
                hasError && 'border-destructive! focus:ring-destructive/30!',
                !date && 'text-muted-foreground hover:text-muted-foreground'
              )}
            >
              <span className="flex-1 text-left truncate">{displayValue}</span>
              <ChevronDownIcon className="size-4 text-muted-foreground shrink-0" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0 w-auto overflow-hidden" align="start">
            <div className="p-3">
              <Calendar
                mode="single"
                captionLayout="dropdown"
                selected={date}
                onSelect={handleSelect}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

Datepicker.displayName = 'Datepicker';
