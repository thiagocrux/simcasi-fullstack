'use client';

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
  ShieldOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { findSessions, revokeSession } from '@/app/actions/session.actions';
import { FindSessionsOutput } from '@/core/application/contracts/session/find-sessions.contract';
import { User } from '@/core/domain/entities/user.entity';
import { usePermission } from '@/hooks/usePermission';
import { useUser } from '@/hooks/useUser';
import { ActionResponse } from '@/lib/actions.utils';
import { exportToCsv } from '@/lib/csv.utils';
import { formatDate } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import {
  findRecordById,
  getTimezoneOffset,
  renderOrFallback,
} from '@/lib/shared.utils';
import { getNextSortDirection } from '@/lib/sort.utils';
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
import { UserPreviewDialog } from '../users/UserPreviewDialog';

type SessionItem = FindSessionsOutput['items'][number];

interface SessionsTableProps {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
  showIdColumn?: boolean;
}

const COLUMN_LABELS: Record<string, string> = {
  id: 'ID',
  userId: 'Usuário',
  ipAddress: 'Endereço IP',
  userAgent: 'User Agent',
  issuedAt: 'Emitida em',
  expiresAt: 'Expira em',
  createdAt: 'Criado em',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS = ['ipAddress', 'userAgent'];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN = 'ipAddress';
const COLUMN_MAX_WIDTH = 'max-w-md';

/**
 * Component to display and manage user sessions in a paginated table.
 * Supports filtering, sorting, and administrative revocation.
 * 
 * NOTE: The actions menu visibility follows these rules:
 * - Read Actions: Visible to all authenticated users.
 * - Delete Actions: Follows 'delete:session' permission or ownership.
 */
export function SessionsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
}: SessionsTableProps) {
  const router = useRouter();
  const { can } = usePermission();
  const { user: loggedUser, isUserAdmin, isHealthProfessional } = useUser();

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [selectedFilterOption, setSelectedFilterOption] = useState<string>(
    DEFAULT_FILTER_COLUMN
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize,
  });

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
    data: sessionList,
    refetch: refetchSessionList,
    isPending: isSessionListPending,
    error: sessionListError,
  } = useQuery({
    queryKey: [
      'find-sessions',
      pagination,
      searchValue,
      selectedFilterOption,
      sorting,
      mounted,
      dateFilter,
    ],
    queryFn: async () => {
      if (!mounted) {
        return {
          success: true,
          data: { items: [], total: 0 },
        } as ActionResponse<FindSessionsOutput>;
      }

      return await findSessions({
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

  const sessions = useMemo(() => {
    if (sessionList?.success) {
      return sessionList.data.items;
    }
    if (sessionList && !sessionList.success) {
      logger.error('Failed to fetch sessions', {
        cause: 'An error occurred while fetching sessions from the API.',
        error: sessionListError,
        action: 'fetch_sessions',
      });
    }
    return [];
  }, [sessionList, sessionListError]);

  const relatedUsers = useMemo(() => {
    if (sessionList?.success) {
      return sessionList.data.relatedUsers;
    }
    return [];
  }, [sessionList]);

  const handleRevoke = useCallback(
    (id: string) => {
      revokeSession(id);
      refetchSessionList();
    },
    [refetchSessionList]
  );

  const columns = useMemo<ColumnDef<SessionItem>[]>(() => {
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
                  className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
                >
                  {COLUMN_LABELS[column.id]}
                  {column.getSortIndex() === 0 &&
                    column.getIsSorted() === 'asc' && <ArrowDownAZ />}
                  {column.getSortIndex() === 0 &&
                    column.getIsSorted() === 'desc' && <ArrowUpZA />}
                </Button>
              ),
              cell: ({ row, column }) => (
                <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
                  {renderOrFallback(row.original.id, (value) => (
                    <HighlightedText
                      text={String(value)}
                      highlight={
                        selectedFilterOption === column.id ? searchValue : ''
                      }
                    />
                  ))}
                </div>
              ),
            },
          ] as ColumnDef<SessionItem>[])
        : []),
      {
        accessorKey: 'userId',
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => {
          const user = findRecordById(relatedUsers || [], row.original.userId);
          return (
            <UserPreviewDialog
              title="Informações do usuário"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              user={user as Omit<User, 'password'>}
            >
              <Button
                variant="link"
                size="sm"
                className={`px-0! ml-1 truncate cursor-pointer ${COLUMN_MAX_WIDTH}`}
              >
                {user?.name || row.original.userId}
              </Button>
            </UserPreviewDialog>
          );
        },
      },
      {
        accessorKey: 'ipAddress',
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue(column.id), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'userAgent',
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue(column.id), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'issuedAt',
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              formatDate(row.getValue(column.id) as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              )
            )}
          </div>
        ),
      },
      {
        accessorKey: 'expiresAt',
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              formatDate(row.getValue(column.id) as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              )
            )}
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
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              formatDate(row.getValue(column.id) as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
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
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              if (next === false) {
                setSorting([]);
              } else {
                column.toggleSorting(next === 'desc');
              }
            }}
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ClockArrowDown />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ClockArrowUp />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue(column.id)
                ? formatDate(row.getValue(column.id) as Date)
                : null,
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
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
          const isOwnSession = row.original.userId === loggedUser?.id;
          const canRevoke = can('delete:session') || isOwnSession;

          return (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-0 w-8 h-8 cursor-pointer">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/sessions/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                {canRevoke && (
                  <AppAlertDialog
                    title="Você tem certeza absoluta?"
                    description="Esta ação não pode ser desfeita. A sessão será revogada permanentemente."
                    cancelAction={{ action: () => {} }}
                    continueAction={{
                      action: () => handleRevoke(String(row.original.id)),
                    }}
                  >
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <ShieldOff /> Revogar sessão
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
    showIdColumn,
    selectedFilterOption,
    searchValue,
    relatedUsers,
    loggedUser,
    isUserAdmin,
    isHealthProfessional,
    can,
    router,
    handleRevoke,
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: sessions,
    columns,
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
    pageCount: sessionList?.success
      ? Math.ceil(sessionList.data.total / pagination.pageSize)
      : -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  function exportData() {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(rows, 'sessions-export');
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData =
    sessionList?.success && (sessionList.data.total ?? 0) > 0;

  return (
    <div className="grid grid-cols-1 mx-auto w-full">
      {(hasRegisteredData || isFiltering) && (
        <AppTableToolbar
          table={table}
          selectedFilterOption={selectedFilterOption}
          setSelectedFilterOption={(value: string) =>
            setSelectedFilterOption(value)
          }
          availableFilterOptions={FILTERABLE_COLUMNS}
          showColumnToggleButton={showColumnToggleButton}
          showFilterInput={showFilterInput}
          showPrintButton={showPrintButton}
          columnLabelMapper={COLUMN_LABELS}
          handleDataExport={exportData}
        />
      )}
      {isSessionListPending ? (
        <CustomSkeleton variant="item-list" />
      ) : hasRows || isFiltering ? (
        <>
          <AppTable
            table={table}
            renderRowContextMenu={(row) => {
              const isOwnSession = row.original.userId === loggedUser?.id;
              const canRevoke = can('delete:session') || isOwnSession;

              return (
                <>
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(`/sessions/${row.original.id}/details`)
                    }
                  >
                    <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                  </ContextMenuItem>
                  {canRevoke && (
                    <>
                      <ContextMenuSeparator />
                      <AppAlertDialog
                        title="Você tem certeza absoluta?"
                        description="Esta ação não pode ser desfeita. A sessão será revogada permanentemente."
                        cancelAction={{ action: () => {} }}
                        continueAction={{
                          action: () => handleRevoke(String(row.original.id)),
                        }}
                      >
                        <ContextMenuItem
                          className="text-destructive cursor-pointer"
                          onSelect={(event) => event.preventDefault()}
                        >
                          <ShieldOff className="mr-2 w-4 h-4" /> Revogar sessão
                        </ContextMenuItem>
                      </AppAlertDialog>
                    </>
                  )}
                </>
              );
            }}
          />
          {hasRows && (
            <AppTablePagination
              table={table}
              showPaginationInput={showPaginationInput}
            />
          )}
        </>
      ) : (
        <EmptyTableFeedback variant="sessions" />
      )}
    </div>
  );
}
