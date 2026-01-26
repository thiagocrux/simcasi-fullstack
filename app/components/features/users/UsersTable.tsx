'use client';

import { User } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type PaginationState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
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
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { deleteUser, findUsers } from '@/app/actions/user.actions';
import { useRoles } from '@/hooks/useRole';
import { exportToCsv } from '@/lib/csv.utils';
import { formatDate } from '@/lib/formatters.utils';
import { renderOrFallback } from '@/lib/shared.utils';
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

const FILTERABLE_COLUMNS: Column[] = ['name', 'email'];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';

export function UsersTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
}: UsersTable) {
  const router = useRouter();
  const { getRoleLabel } = useRoles();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFilterOption, setSelectedFilterOption] = useState<Column>(
    DEFAULT_FILTER_COLUMN
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

  const searchValue = useMemo(() => {
    const filter = columnFilters.find((f) => f.id === selectedFilterOption);
    return (filter?.value as string) ?? '';
  }, [columnFilters, selectedFilterOption]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue]);

  const { data: userList } = useQuery({
    queryKey: ['find-users', pagination, searchValue],
    queryFn: async () =>
      await findUsers({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        search: searchValue,
        includeDeleted: false,
      }),
  });

  const users = useMemo(() => {
    if (userList?.success) {
      return userList.data.items;
    }
    return [];
  }, [userList]);

  const handleDelete = useCallback((id: string) => {
    deleteUser(id);
  }, []);

  const columns = useMemo<ColumnDef<Partial<User>>[]>(() => {
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
                highlight={selectedFilterOption === 'id' ? searchValue : ''}
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
                highlight={selectedFilterOption === 'name' ? searchValue : ''}
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
                highlight={selectedFilterOption === 'email' ? searchValue : ''}
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
                text={getRoleLabel(value) ?? value}
                highlight={selectedFilterOption === 'roleId' ? searchValue : ''}
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
                  highlight={
                    selectedFilterOption === 'createdAt' ? searchValue : ''
                  }
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
                highlight={
                  selectedFilterOption === 'updatedBy' ? searchValue : ''
                }
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
                  highlight={
                    selectedFilterOption === 'updatedAt' ? searchValue : ''
                  }
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
                  highlight={
                    selectedFilterOption === 'deletedAt' ? searchValue : ''
                  }
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
                    action: () => handleDelete(row.getValue('id')),
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
  }, [searchValue, selectedFilterOption, handleDelete, router, getRoleLabel]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users as User[],
    columns,
    rowCount: userList?.success ? userList.data.total : 0,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualFiltering: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const hasRows = table.getRowModel().rows?.length;

  async function exportData() {
    const total = userList && userList.success ? userList.data.total : 0;
    if (!total) {
      return;
    }

    const response = await findUsers({
      skip: 0,
      take: total,
      search: searchValue,
      includeDeleted: false,
    });
    if (response.success) {
      exportToCsv(response.data.items, 'data-table-export');
    }
  }

  return (
    <div className="grid grid-cols-1 mx-auto w-full">
      <AppTableToolbar
        table={table}
        selectedFilterOption={selectedFilterOption}
        setSelectedFilterOption={(value: string) =>
          setSelectedFilterOption(value as Column)
        }
        availableFilterOptions={FILTERABLE_COLUMNS}
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
