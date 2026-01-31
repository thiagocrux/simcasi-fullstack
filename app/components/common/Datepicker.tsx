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
 *
 * @typedef {Object} DatepickerProps
 * @property {Date|string|undefined} [value] The selected date, as a Date object or a string (ISO or 'yyyy-MM-dd' format). Optional.
 * @property {(date: string | undefined) => void} onValueChange Callback function called when the date changes. Receives the new date as an ISO string or undefined.
 * @property {string} placeholder Placeholder text displayed when no date is selected.
 * @property {boolean} [hasError] If true, applies error styling to the input. Optional.
 * @property {boolean} [disabled] If true, disables the datepicker input. Optional.
 */
interface DatepickerProps {
  /** Accepts Date or ISO / yyyy-MM-dd strings */
  value?: Date | string | undefined;
  onValueChange: (date: string | undefined) => void;
  placeholder: string;
  hasError?: boolean;
  disabled?: boolean;
}

/**
 * Attempts to parse a value into a valid Date object.
 *
 * Tries to interpret the input as a Date instance, an ISO string, or a 'yyyy-MM-dd' string.
 * Returns undefined if the value is invalid or cannot be parsed.
 *
 * @param {Date|string|undefined} value The value to parse (Date, ISO string, or 'yyyy-MM-dd' string).
 * @return {Date|undefined} The parsed Date object, or undefined if the input is invalid.
 */
function parseDate(value?: Date | string | undefined): Date | undefined {
  if (!value) return undefined;
  if (value instanceof Date) return isValid(value) ? value : undefined;

  // Try parsing as ISO string first
  try {
    const iso = parseISO(value);
    if (isValid(iso)) return iso;
  } catch {
    // Ignore parsing errors
  }

  // Try parsing as 'yyyy-MM-dd' (common input format)
  try {
    const d = parse(String(value), 'yyyy-MM-dd', new Date());
    if (isValid(d)) return d;
  } catch {
    // Ignore parsing errors
  }

  return undefined;
}

/**
 * Datepicker component for selecting a single date using a popover calendar UI.
 *
 * Provides a button that opens a calendar popover for date selection. Supports controlled and uncontrolled usage.
 *
 * @param {DatepickerProps} props The props for the Datepicker component.
 * @param {React.Ref<HTMLButtonElement>} ref Ref to the button element for accessibility and focus control.
 * @return {JSX.Element} The rendered Datepicker component.
 */
export const Datepicker = React.forwardRef<HTMLButtonElement, DatepickerProps>(
  (
    {
      value,
      onValueChange,
      placeholder = 'Selecione uma data',
      hasError = false,
      disabled,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(() =>
      parseDate(value)
    );

    // Synchronize internal state if parent passes a new value
    React.useEffect(() => {
      setDate(parseDate(value));
    }, [value]);

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
                'justify-between w-full font-normal',
                hasError && 'border-destructive! focus:ring-destructive/30!',
                !date && 'text-muted-foreground hover:text-muted-foreground'
              )}
            >
              {date ? format(date, 'dd/MM/yyyy') : placeholder}
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
);

/**
 * Display name for the Datepicker component, used for debugging and React DevTools.
 * @type {string}
 */
Datepicker.displayName = 'Datepicker';
