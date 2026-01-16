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
import { User } from '@/prisma/generated/client';
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

interface UsersTable {
  data: User[];
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
}

type Column =
  | 'id'
  | 'name'
  | 'email'
  | 'roleId'
  | 'createdAt'
  | 'updatedBy'
  | 'updatedAt'
  | 'deletedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  name: 'Nome',
  email: 'E-mail',
  roleId: 'Nível de permissão',
  createdAt: 'Criado em',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
  deletedAt: 'Deletado em',
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';

export function UsersTable({
  data,
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
}: UsersTable) {
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

  const columns = useMemo<ColumnDef<Partial<User>>[]>(() => {
    const filterValue =
      (columnFilters.find((filter) => filter.id === filterOption)
        ?.value as string) ?? '';

    return [
      {
        accessorKey: 'id',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              ID
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ArrowDownAZ />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ArrowUpZA />}
            </Button>
          );
        },
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
        accessorKey: 'name',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Nome
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ArrowDownAZ />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ArrowUpZA />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('name'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'name' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'email',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              E-mail
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ArrowDownAZ />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ArrowUpZA />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('email'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'email' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'roleId',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Nível de permissão
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ArrowDownAZ />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ArrowUpZA />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('roleId'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'roleId' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        sortingFn: 'datetime',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Criado em
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ClockArrowDown />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ClockArrowUp />}
            </Button>
          );
        },
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
        accessorKey: 'updatedBy',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Atualizado por
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ArrowDownAZ />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ArrowUpZA />}
            </Button>
          );
        },
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('updatedBy'), (value) => (
              <HighlightedText
                text={value}
                highlight={filterOption === 'updatedBy' ? filterValue : ''}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'updatedAt',
        sortingFn: 'datetime',
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Atualizado em
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ClockArrowDown />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ClockArrowUp />}
            </Button>
          );
        },
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
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() =>
                column.toggleSorting(column.getIsSorted() === 'asc')
              }
              className="px-1! cursor-pointer"
            >
              Deletado em
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'asc' && <ClockArrowDown />}
              {column.getSortIndex() === 0 &&
                column.getIsSorted() === 'desc' && <ClockArrowUp />}
            </Button>
          );
        },
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
                    router.push(`/users/${row.getValue('id')}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(`/users/${row.getValue('id')}`)}
                >
                  <Pen />
                  Editar usuário
                </DropdownMenuItem>
                <AppAlertDialog
                  title="Você tem certeza absoluta?"
                  description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
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
                    Deletar usuário
                  </DropdownMenuItem>
                </AppAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [columnFilters, filterOption, handleDelete, router]);

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
    const rows = table.getFilteredRowModel().rows.map((row) => {
      const { password: _password, ...rest } = row.original;
      void _password;
      return rest;
    });

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
