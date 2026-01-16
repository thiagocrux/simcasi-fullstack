'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import {
  ArrowDownAZ,
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

import { exportToCsv } from '@/lib/csv.utils';
import { formatDate } from '@/lib/formatters.utils';
import { renderOrFallback } from '@/lib/shared.utils';
import { Exam } from '@/prisma/generated/client';
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

interface ExamsTable {
  data: Exam[];
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
}

type Column =
  | 'id'
  | 'patientId'
  | 'treponemalTestType'
  | 'treponemalTestResult'
  | 'treponemalTestDate'
  | 'treponemalTestLocation'
  | 'nontreponemalVdrlTest'
  | 'nontreponemalTestTitration'
  | 'nontreponemalTestDate'
  | 'otherNontreponemalTest'
  | 'otherNontreponemalTestDate'
  | 'referenceObservations'
  | 'createdBy'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  patientId: 'Paciente',
  treponemalTestType: 'Tipo de teste treponêmico ',
  treponemalTestResult: 'Resultado do teste treponêmico',
  treponemalTestDate: 'Data do teste treponêmico',
  treponemalTestLocation: 'Local do teste treponêmico',
  nontreponemalVdrlTest: 'Teste VDRL não treponêmico',
  nontreponemalTestTitration: 'Titulação do teste não treponêmico',
  nontreponemalTestDate: 'Data do teste não treponêmico',
  otherNontreponemalTest: 'Outro teste não treponêmico',
  otherNontreponemalTestDate: 'Data de outro teste não treponêmico',
  referenceObservations: 'Observações de referência',
  createdBy: 'Criado por',
  createdAt: 'Criado em',
  updatedAt: 'Atualizado em',
  deletedAt: 'Deletado em',
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'treponemalTestType';

export function ExamsTable({
  data,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
}: ExamsTable) {
  const router = useRouter();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const [filterOption, setFilterOption] = useState<Column>(
    DEFAULT_FILTER_COLUMN
  );

  // TODO: Implement real delete functionality.
  function handleDelete() {
    console.log(`Delete called for ID: ${data[0].id}`);
  }

  const columns = useMemo<ColumnDef<Partial<Exam>>[]>(() => {
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
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
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
        accessorKey: 'treponemalTestType',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Tipo de teste treponêmico
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
            {renderOrFallback(row.getValue('treponemalTestType'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  filterOption === 'treponemalTestType' ? filterValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'treponemalTestResult',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Resultado do teste treponêmico
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
            {renderOrFallback(row.getValue('treponemalTestResult'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  filterOption === 'treponemalTestResult' ? filterValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'treponemalTestDate',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Data do teste treponêmico
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
              formatDate(row.getValue('treponemalTestDate') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'treponemalTestDate' ? filterValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'treponemalTestLocation',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Local do teste treponêmico
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
            {renderOrFallback(
              row.getValue('treponemalTestLocation'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'treponemalTestLocation' ? filterValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'nontreponemalVdrlTest',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Teste VDRL não treponêmico
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
            {renderOrFallback(
              row.getValue('nontreponemalVdrlTest'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'nontreponemalVdrlTest' ? filterValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'nontreponemalTestTitration',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Titulação do teste não treponêmico
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
            {renderOrFallback(
              row.getValue('nontreponemalTestTitration'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'nontreponemalTestTitration'
                      ? filterValue
                      : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'nontreponemalTestDate',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Data do teste não treponêmico
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
              formatDate(row.getValue('nontreponemalTestDate') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'nontreponemalTestDate' ? filterValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'otherNontreponemalTest',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Outro teste não treponêmico
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
            {renderOrFallback(
              row.getValue('otherNontreponemalTest'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'otherNontreponemalTest' ? filterValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'otherNontreponemalTestDate',
        sortingFn: 'datetime',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Data de outro teste não treponêmico
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
              formatDate(row.getValue('otherNontreponemalTestDate') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'otherNontreponemalTestDate'
                      ? filterValue
                      : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'referenceObservations',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Observações de referência
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
            {renderOrFallback(
              row.getValue('referenceObservations'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    filterOption === 'referenceObservations' ? filterValue : ''
                  }
                />
              )
            )}
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
                    router.push(`/exams/${row.getValue('id')}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(
                      `patients/${row.getValue(
                        'patientId'
                      )}/exams/${row.getValue('id')}`
                    )
                  }
                >
                  <Pen />
                  Editar exame
                </DropdownMenuItem>
                <AppAlertDialog
                  title="Você tem certeza absoluta?"
                  description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o exame."
                  cancelAction={{ action: () => {} }}
                  continueAction={{
                    action: handleDelete,
                  }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <Trash2 />
                    Deletar exame
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
        setFilterOption={(valueue: string) =>
          setFilterOption(valueue as Column)
        }
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
