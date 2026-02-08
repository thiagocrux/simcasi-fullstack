'use client';

import { User } from '@prisma/client';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
  Plus,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import { deleteUser, findUsers } from '@/app/actions/user.actions';
import { usePermission } from '@/hooks/usePermission';
import { useRole } from '@/hooks/useRole';
import { exportToCsv } from '@/lib/csv.utils';
import { formatDate } from '@/lib/formatters.utils';
import { getTimezoneOffset, renderOrFallback } from '@/lib/shared.utils';
import { getNextSortDirection } from '@/lib/sort.utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { AppAlertDialog } from '../../common/AppAlertDialog';
import { AppTable } from '../../common/AppTable';
import { AppTablePagination } from '../../common/AppTablePagination';
import { AppTableToolbar } from '../../common/AppTableToolbar';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { EmptyTableFeedback } from '../../common/EmptyTableFeedback';
import { HighlightedText } from '../../common/HighlightedText';
import { Button } from '../../ui/button';
import { ContextMenuItem, ContextMenuSeparator } from '../../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface UsersTableProps {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
  showIdColumn?: boolean;
}

type Column =
  | 'id'
  | 'name'
  | 'email'
  | 'roleId'
  | 'createdBy'
  | 'createdAt'
  | 'updatedBy'
  | 'updatedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  name: 'Nome',
  email: 'E-mail',
  roleId: 'Nível de permissão',
  createdBy: 'Criado por',
  createdAt: 'Criado em',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS: Column[] = ['name', 'email'];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';
const COLUMN_MAX_WIDTH = 'max-w-md';

export function UsersTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
}: UsersTableProps) {
  const router = useRouter();
  const { getRoleLabel } = useRole();
  const { can } = usePermission();

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

  // Avoid hydration mismatch by only rendering after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const searchValue = useMemo(() => {
    const filter = columnFilters.find(
      (filter) => filter.id === selectedFilterOption
    );
    return (filter?.value as string) ?? '';
  }, [columnFilters, selectedFilterOption]);

  const dateFilter = useMemo(() => {
    const filter = columnFilters.find((filter) => filter.id === 'createdAt');
    return filter?.value as { start?: string; end?: string } | undefined;
  }, [columnFilters]);

  const isSearching = searchValue.trim() !== '';
  const isFilteringByDate = !!(dateFilter?.start || dateFilter?.end);
  const isFiltering = isSearching || isFilteringByDate;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue, dateFilter]);

  const {
    data: userList,
    refetch: refetchUserList,
    isPending,
  } = useQuery({
    queryKey: [
      'find-users',
      pagination,
      searchValue,
      selectedFilterOption,
      sorting,
      mounted,
      dateFilter,
    ],
    queryFn: async () => {
      if (!mounted) {
        return { success: true, data: { items: [], total: 0 } };
      }

      return await findUsers({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: sorting[0]?.id,
        orderDir: sorting[0]?.desc ? 'desc' : 'asc',
        search: searchValue,
        searchBy: selectedFilterOption,
        includeDeleted: false,
        startDate: dateFilter?.start,
        endDate: dateFilter?.end,
        timezoneOffset: getTimezoneOffset(),
        includeRelatedUsers: true,
      });
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const users = useMemo(() => {
    if (userList?.success) {
      return userList.data.items;
    }
    return [];
  }, [userList]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteUser(id);
      refetchUserList();
    },
    [refetchUserList]
  );

  const columns = useMemo<ColumnDef<Partial<User>>[]>(() => {
    return [
      ...(showIdColumn
        ? ([
            {
              accessorKey: 'id',
              header: ({ column }) => (
                <Button
                  variant="ghost"
                  onClick={() => {
                    const next = getNextSortDirection(column.getIsSorted());
                    if (next === false) {
                      setSorting([]);
                    } else {
                      column.toggleSorting(next === 'desc');
                    }
                  }}
                  className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
                >
                  ID
                  {column.getSortIndex() === 0 &&
                    column.getIsSorted() === 'asc' && <ArrowDownAZ />}
                  {column.getSortIndex() === 0 &&
                    column.getIsSorted() === 'desc' && <ArrowUpZA />}
                </Button>
              ),
              cell: ({ row }) => (
                <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
                  {renderOrFallback(row.getValue('id'), (value) => (
                    <HighlightedText
                      text={value}
                      highlight={
                        selectedFilterOption === 'id' ? searchValue : ''
                      }
                    />
                  ))}
                </div>
              ),
            },
          ] as ColumnDef<Partial<User>>[])
        : []),
      {
        accessorKey: 'name',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Nome
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            E-mail
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Nível de permissão
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
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
        accessorKey: 'createdBy',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('createdBy'), (value) => (
              <HighlightedText
                text={value as string}
                highlight={
                  selectedFilterOption === 'createdBy' ? searchValue : ''
                }
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
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Atualizado por
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('updatedBy'), (value) => (
              <HighlightedText
                text={value as string}
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
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

                {can('update:user') && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/users/${row.getValue('id')}`)}
                  >
                    <Pen />
                    Editar usuário
                  </DropdownMenuItem>
                )}

                {can('delete:user') && (
                  <AppAlertDialog
                    title="Você tem certeza absoluta?"
                    description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
                    cancelAction={{ action: () => {} }}
                    continueAction={{
                      action: () => handleDelete(row.getValue('id')),
                    }}
                  >
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Trash2 />
                      Deletar usuário
                    </DropdownMenuItem>
                  </AppAlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [
    searchValue,
    selectedFilterOption,
    handleDelete,
    router,
    getRoleLabel,
    showIdColumn,
    can,
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: users as User[],
    columns,
    rowCount: userList?.success ? userList.data.total : 0,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

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
      orderBy: sorting[0]?.id,
      orderDir: sorting[0]?.desc ? 'desc' : 'asc',
    });
    if (response.success) {
      exportToCsv(response.data.items, 'data-table-export');
    }
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData = userList?.success && (userList.data.total ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 mx-auto w-full">
      {(hasRegisteredData || isFiltering) && (
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
        >
          {can('create:user') && (
            <Button
              variant="outline"
              className="self-end cursor-pointer select-none"
              onClick={() => router.push('/users/new')}
            >
              <Plus />
              Cadastrar usuário
            </Button>
          )}
        </AppTableToolbar>
      )}

      {isPending ? (
        <CustomSkeleton variant="item-list" />
      ) : hasRows || isFiltering ? (
        <>
          <AppTable
            table={table}
            renderRowContextMenu={(row) => (
              <>
                <ContextMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/users/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>

                {can('update:user') && (
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/users/${row.original.id}`)}
                  >
                    <Pen className="mr-2 w-4 h-4" />
                    Editar usuário
                  </ContextMenuItem>
                )}

                {can('delete:user') && (
                  <>
                    <ContextMenuSeparator />
                    <AppAlertDialog
                      title="Você tem certeza absoluta?"
                      description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o usuário."
                      cancelAction={{ action: () => {} }}
                      continueAction={{
                        action: () => handleDelete(String(row.original.id)),
                      }}
                    >
                      <ContextMenuItem
                        className="text-destructive cursor-pointer"
                        onSelect={(event) => event.preventDefault()}
                      >
                        <Trash2 className="mr-2 w-4 h-4" />
                        Deletar usuário
                      </ContextMenuItem>
                    </AppAlertDialog>
                  </>
                )}
              </>
            )}
          />
          {hasRows && (
            <AppTablePagination
              table={table}
              showPaginationInput={showPaginationInput}
            />
          )}
        </>
      ) : (
        <EmptyTableFeedback variant="users" />
      )}
    </div>
  );
}
