'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp10,
  ArrowUpZA,
  ClockArrowDown,
  ClockArrowUp,
  Eye,
  MoreHorizontal,
  Pen,
  Trash2,
} from 'lucide-react';

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import { exportToCsv } from '@/lib/exportToCsv';
import { formatDate } from '@/lib/formatters';
import { renderOrFallback } from '@/lib/utils';
import { Observation } from '@/prisma/generated/client';
import { AppAlertDialog } from '../../common/AppAlertDialog';
import { AppTable } from '../../common/AppTable';
import { AppTablePagination } from '../../common/AppTablePagination';
import { AppTableToolbar } from '../../common/AppTableToolbar';
import { HighlightedText } from '../../common/HighlightedText';
import { Button } from '../../ui/button';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface ObservationsTable {
  data: Observation[];
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
}

type Column =
  | 'id'
  | 'patientId'
  | 'observations'
  | 'hasPartnerBeingTreated'
  | 'createdBy'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  patientId: 'Paciente',
  observations: 'Observações',
  hasPartnerBeingTreated: 'Parceiro sendo tratado?',
  createdBy: 'Criado por',
  createdAt: 'Criado em',
  updatedAt: 'Atualizado em',
  deletedAt: 'Deletado em',
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'observations';

export function ObservationsTable({
  data,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
}: ObservationsTable) {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [filterOption, setFilterOption] = useState<Column>(
    DEFAULT_FILTER_COLUMN
  );

  const columns = useMemo<ColumnDef<Partial<Observation>>[]>(() => {
    const filterValue =
      (columnFilters.find((filter) => filter.id === filterOption)
        ?.value as string) ?? '';

    return [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            ID
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('id'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'id' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'observations',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Observações
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('observations'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'observations' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'hasPartnerBeingTreated',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Parceiro sendo tratado?
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            <HighlightedText
              text={row.getValue('hasPartnerBeingTreated') ? 'Sim' : 'Não'}
              highlight={
                filterOption === 'hasPartnerBeingTreated' ? filterValue : ''
              }
            />
          </div>
        ),
      },
      {
        accessorKey: 'patientId',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Paciente
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('patientId'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'patientId' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'createdBy',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Criado por
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('createdBy'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'createdBy' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Criado em
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(
              formatDate(row.getValue('createdAt') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={filterOption === 'createdAt' ? filterValue : ''}
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'updatedAt',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Atualizado em
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(
              formatDate(row.getValue('updatedAt') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={filterOption === 'updatedAt' ? filterValue : ''}
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'deletedAt',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Deletado em
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(
              formatDate(row.getValue('deletedAt') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={filterOption === 'deletedAt' ? filterValue : ''}
                />
              )
            )}
          </div>
        ),
      },

      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => {
          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-8 h-8">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/observations/${row.getValue('id')}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/observations/${row.getValue('id')}`)
                  }
                >
                  <Pen />
                  Editar observação
                </DropdownMenuItem>
                <AppAlertDialog
                  title="Você tem certeza absoluta?"
                  description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
                  cancelAction={{ action: () => {} }}
                  continueAction={{
                    action: () => {
                      alert(row.getValue('id'));
                    },
                  }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <Trash2 />
                    Deletar observação
                  </DropdownMenuItem>
                </AppAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [columnFilters, filterOption, router]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const hasRows = table.getRowModel().rows?.length;

  function exportData() {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(rows, 'data-table-export');
  }

  return (
    <div className="grid grid-cols-1 mx-auto w-full">
      <AppTableToolbar
        table={table}
        filterOption={filterOption}
        setFilterOption={(value: string) => setFilterOption(value as Column)}
        showColumnToggleButton={showColumnToggleButton}
        showFilterInput={showFilterInput}
        showPrintButton={showPrintButton}
        columnLabelMapper={COLUMN_LABELS}
        handleDataExport={exportData}
      />

      <AppTable table={table} />

      {hasRows ? (
        <AppTablePagination
          table={table}
          showPaginationInput={showPaginationInput}
        />
      ) : null}
    </div>
  );
}
