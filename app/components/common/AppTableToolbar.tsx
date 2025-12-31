'use client';

import { Table } from '@tanstack/react-table';
import { ChevronDown, Eye, Printer, Search, X } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';

interface AppTableToolbar {
  table: Table<Partial<unknown>>;
  columnLabelMapper: Record<string, string>;
  filterOptions?: string[];
  filterOption?: string;
  setFilterOption: (value: string) => void;
  handleDataExport: () => void;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  className?: string;
}

function TableFilter({
  table,
  filterOption,
  setFilterOption,
  columnLabelMapper,
}: {
  table: Table<Partial<unknown>>;
  filterOption: string;
  setFilterOption: (value: string) => void;
  columnLabelMapper: Record<string, string>;
}) {
  return (
    <InputGroup className="max-w-full md:max-w-[500px]">
      <InputGroupInput
        type="text"
        placeholder="Pesquisar por..."
        value={
          (table.getColumn(filterOption)?.getFilterValue() as string) ?? ''
        }
        onChange={(event) =>
          table.getColumn(filterOption)?.setFilterValue(event.target.value)
        }
        className="w-full"
      />
      <InputGroupAddon
        align="inline-start"
        onClick={() => table.getColumn(filterOption)?.setFilterValue('')}
        className="cursor-pointer"
      >
        <Search />
      </InputGroupAddon>

      {table.getColumn(filterOption)?.getFilterValue() ? (
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          className="mr-1 size-6 cursor-pointer"
        >
          <X />
        </Button>
      ) : null}

      <InputGroupAddon align="inline-end" className="cursor-pointer">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="-mr-1.25 ml-auto border-t-0 border-r-0 border-b-0 border-l rounded-tl-none rounded-bl-none h-8.5 cursor-pointer"
              size="sm"
            >
              {columnLabelMapper[filterOption]} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {Object.keys(columnLabelMapper).map((key) => (
              <DropdownMenuItem
                key={key}
                className="cursor-pointer"
                onClick={() => {
                  table.getColumn(filterOption)?.setFilterValue('');
                  setFilterOption(key as string);
                }}
              >
                {columnLabelMapper[key as string]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  );
}

function TableColumnToggle({
  table,
  columnLabelMapper,
}: {
  table: Table<Partial<unknown>>;
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

export function AppTableToolbar({
  table,
  columnLabelMapper,
  filterOption,
  setFilterOption,
  handleDataExport,
  showFilterInput = false,
  showPrintButton = true,
  showColumnToggleButton = false,
  className,
}: AppTableToolbar) {
  return (
    <div
      className={cn(
        'flex sm:flex-row flex-col items-center gap-2 py-4',
        className
      )}
    >
      {showFilterInput && filterOption && (
        <TableFilter
          table={table}
          filterOption={filterOption}
          setFilterOption={setFilterOption}
          columnLabelMapper={columnLabelMapper}
        />
      )}

      <div className="flex gap-x-2 ml-auto">
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
    </div>
  );
}
