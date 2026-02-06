'use client';

import { Table } from '@tanstack/react-table';
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Printer,
  SlidersHorizontal,
  X,
} from 'lucide-react';
import { ReactNode, useState } from 'react';
import { toast } from 'sonner';

import { logger } from '@/lib/logger.utils';
import { cn } from '@/lib/shared.utils';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Field } from '../ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import { Label } from '../ui/label';
import { Datepicker } from './Datepicker';

interface AppTableToolbarProps<TData> {
  table: Table<TData>;
  columnLabelMapper: Record<string, string>;
  availableFilterOptions?: string[];
  selectedFilterOption?: string;
  setSelectedFilterOption: (value: string) => void;
  handleDataExport: () => void;
  dateColumnId?: string;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showAdvancedFilters?: boolean;
  className?: string;
  children?: ReactNode;
}

function TableFilter<TData>({
  table,
  selectedFilterOption,
  availableFilterOptions,
  setSelectedFilterOption,
  columnLabelMapper,
}: {
  table: Table<TData>;
  selectedFilterOption: string;
  availableFilterOptions?: string[];
  setSelectedFilterOption: (value: string) => void;
  columnLabelMapper: Record<string, string>;
}) {
  const filterValue =
    (table.getColumn(selectedFilterOption)?.getFilterValue() as string) ?? '';

  return (
    <InputGroup className="max-w-full">
      <InputGroupInput
        type="text"
        placeholder="Pesquisar por..."
        value={filterValue}
        onChange={(event) =>
          table
            .getColumn(selectedFilterOption)
            ?.setFilterValue(event.target.value)
        }
      />
      {filterValue && (
        <Button
          size="icon-sm"
          variant="ghost"
          className="mr-1 size-6 cursor-pointer"
          onClick={() =>
            table.getColumn(selectedFilterOption)?.setFilterValue('')
          }
        >
          <X />
        </Button>
      )}

      <InputGroupAddon align="inline-end" className="cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="-mr-1.25 ml-auto border-t-0 border-r-0 border-b-0 border-l rounded-tl-none rounded-bl-none h-8.5 cursor-pointer"
              size="sm"
            >
              {columnLabelMapper[selectedFilterOption]} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(availableFilterOptions || Object.keys(columnLabelMapper)).map(
              (key) => (
                <DropdownMenuItem
                  key={key}
                  className="cursor-pointer"
                  onClick={() => {
                    table.getColumn(selectedFilterOption)?.setFilterValue('');
                    setSelectedFilterOption(key as string);
                  }}
                >
                  {columnLabelMapper[key as string]}
                </DropdownMenuItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}

function TableColumnToggle<TData>({
  table,
  columnLabelMapper,
}: {
  table: Table<TData>;
  columnLabelMapper: Record<string, string>;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          <Eye /> <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="cursor-pointer"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {columnLabelMapper[column.id]}
              </DropdownMenuCheckboxItem>
            );
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppTableToolbar<TData>({
  table,
  columnLabelMapper,
  selectedFilterOption,
  availableFilterOptions,
  setSelectedFilterOption,
  handleDataExport,
  dateColumnId = 'createdAt',
  showFilterInput = false,
  showPrintButton = true,
  showColumnToggleButton = false,
  showAdvancedFilters = true,
  className,
  children,
}: AppTableToolbarProps<TData>) {
  const [displayAdvancedFilters, setDisplayAdvancedFilters] =
    useState<boolean>(false);

  const initialDateFilter =
    (table.getColumn(dateColumnId)?.getFilterValue() as {
      start?: string;
      end?: string;
    }) || {};
  const [startDate, setStartDate] = useState<string | undefined>(
    initialDateFilter.start
  );
  const [endDate, setEndDate] = useState<string | undefined>(
    initialDateFilter.end
  );

  const handleDateChange = (
    date: string | undefined,
    type: 'start' | 'end'
  ) => {
    const column = table.getColumn(dateColumnId);
    if (!column) return;

    const currentFilter =
      (column.getFilterValue() as { start?: string; end?: string }) || {};

    if (type === 'start') {
      setStartDate(date);
      column.setFilterValue({
        ...currentFilter,
        start: date,
      });
    } else {
      setEndDate(date);
      column.setFilterValue({
        ...currentFilter,
        end: date,
      });
    }

    logger.info('[HANDLE_DATA_CHANGE]', { start: startDate, end: endDate });
  };

  return (
    <div>
      <div
        className={cn(
          'flex sm:flex-row justify-between items-center gap-2 mb-4',
          className
        )}
      >
        {children}

        {showAdvancedFilters && (
          <Button
            variant="outline"
            className="self-end cursor-pointer select-none"
            onClick={() => setDisplayAdvancedFilters((prevState) => !prevState)}
          >
            <SlidersHorizontal />
            {displayAdvancedFilters ? <ChevronUp /> : <ChevronDown />}
          </Button>
        )}
      </div>
      {displayAdvancedFilters && (
        <div
          className={cn(
            'flex xs:flex-row flex-col flex-wrap items-baseline gap-x-2 gap-y-4 mb-4',
            'transition-all duration-200 ease-in-out opacity-100 translate-y-0 animate-in fade-in'
          )}
        >
          {showFilterInput && selectedFilterOption && (
            <Field className="lg:flex-1 min-w-full lg:min-w-auto">
              <Label>Pesquisar</Label>
              <TableFilter
                table={table}
                selectedFilterOption={selectedFilterOption}
                availableFilterOptions={availableFilterOptions}
                setSelectedFilterOption={setSelectedFilterOption}
                columnLabelMapper={columnLabelMapper}
              />
            </Field>
          )}

          <Field className="flex-1 min-w-[200px]">
            <Label>Data inicial</Label>
            <Datepicker
              placeholder="dd/mm/aaaa"
              value={startDate}
              hidden={endDate ? { after: new Date(endDate) } : undefined}
              onValueChange={(dateStr) => {
                logger.info(dateStr);
                if (endDate && dateStr && dateStr > endDate) {
                  toast.error(
                    'A data inicial não pode ser maior que a data final.'
                  );
                  setStartDate(undefined);
                  handleDateChange(undefined, 'start');
                  return;
                }
                setStartDate(dateStr);
                handleDateChange(dateStr, 'start');
              }}
            />
          </Field>

          <Field className="flex-1 min-w-[200px]">
            <Label>Data final</Label>
            <Datepicker
              placeholder="dd/mm/aaaa"
              value={endDate}
              hidden={startDate ? { before: new Date(startDate) } : undefined}
              onValueChange={(dateStr) => {
                logger.info(dateStr);
                if (startDate && dateStr && dateStr < startDate) {
                  toast.error(
                    'A data final não pode ser menor que a data inicial.'
                  );
                  setEndDate(undefined);
                  handleDateChange(undefined, 'end');
                  return;
                }
                setEndDate(dateStr);
                handleDateChange(dateStr, 'end');
              }}
            />
          </Field>

          <Field className="flex-1 mt-auto max-w-min">
            <div className="flex gap-2">
              {showPrintButton && (
                <Button
                  variant="outline"
                  className="self-end cursor-pointer select-none"
                  onClick={handleDataExport}
                >
                  <Printer />
                </Button>
              )}
              {showColumnToggleButton && (
                <TableColumnToggle
                  table={table}
                  columnLabelMapper={columnLabelMapper}
                />
              )}
            </div>
          </Field>
        </div>
      )}
    </div>
  );
}
