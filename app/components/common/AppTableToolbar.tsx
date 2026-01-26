'use client';

import { Table } from '@tanstack/react-table';
import { ChevronDown, Eye, Printer, Search, X } from 'lucide-react';

import { cn } from '@/lib/shared.utils';
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
  availableFilterOptions?: string[];
  selectedFilterOption?: string;
  setSelectedFilterOption: (value: string) => void;
  handleDataExport: () => void;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  className?: string;
}

function TableFilter({
  table,
  selectedFilterOption,
  availableFilterOptions,
  setSelectedFilterOption,
  columnLabelMapper,
}: {
  table: Table<Partial<unknown>>;
  selectedFilterOption: string;
  availableFilterOptions?: string[];
  setSelectedFilterOption: (value: string) => void;
  columnLabelMapper: Record<string, string>;
}) {
  return (
    <InputGroup className="max-w-full md:max-w-[500px]">
      <InputGroupInput
        type="text"
        placeholder="Pesquisar por..."
        value={
          (table.getColumn(selectedFilterOption)?.getFilterValue() as string) ??
          ''
        }
        onChange={(event) =>
          table
            .getColumn(selectedFilterOption)
            ?.setFilterValue(event.target.value)
        }
        className="w-full"
      />
      <InputGroupAddon
        align="inline-start"
        onClick={() =>
          table.getColumn(selectedFilterOption)?.setFilterValue('')
        }
        className="cursor-pointer"
      >
        <Search />
      </InputGroupAddon>

      {table.getColumn(selectedFilterOption)?.getFilterValue() ? (
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
  selectedFilterOption,
  availableFilterOptions,
  setSelectedFilterOption,
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
      {showFilterInput && selectedFilterOption && (
        <TableFilter
          table={table}
          selectedFilterOption={selectedFilterOption}
          availableFilterOptions={availableFilterOptions}
          setSelectedFilterOption={setSelectedFilterOption}
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
