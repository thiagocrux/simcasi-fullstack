'use client';

import {
  Action,
  AuditLog,
  EntityName,
} from '@/core/domain/entities/audit-log.entity';
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
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { findAuditLogs } from '@/app/actions/audit-log.actions';
import { FindAuditLogsOutput } from '@/core/application/contracts/audit-log/find-audit-logs.contract';
import {
  ACTION_LABELS,
  ENTITY_LABELS,
} from '@/core/domain/constants/audit-log.constants';
import { User } from '@/core/domain/entities/user.entity';
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
import { AppTable } from '../../common/AppTable';
import { AppTablePagination } from '../../common/AppTablePagination';
import { AppTableToolbar } from '../../common/AppTableToolbar';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { EmptyTableFeedback } from '../../common/EmptyTableFeedback';
import { HighlightedText } from '../../common/HighlightedText';
import { Badge, BadgeProps } from '../../ui/badge';
import { Button } from '../../ui/button';
import { ContextMenuItem } from '../../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { UserPreviewDialog } from '../users/UserPreviewDialog';
import { EntityPreviewWrapper } from './EntityPreviewWrapper';

interface AuditLogsTableProps {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
  showIdColumn?: boolean;
}

const COLUMN_LABELS: Record<string, string> = {
  id: 'ID',
  userId: 'Autor',
  action: 'Ação',
  entityName: 'Entidade',
  entityId: 'ID do registro',
  oldValues: 'Valores antigos',
  newValues: 'Valores novos',
  ipAddress: 'Endereço IP',
  userAgent: 'User agent',
  createdAt: 'Criado em',
};

const FILTERABLE_COLUMNS: string[] = [
  'userId',
  'action',
  'entityName',
  'ipAddress',
  'userAgent',
];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN = 'action';
const COLUMN_MAX_WIDTH = 'max-w-[150px] sm:max-w-[200px] lg:max-w-[250px]';

const ACTION_VARIANTS: Record<string, BadgeProps['variant']> = {
  CREATE: 'success',
  UPDATE: 'warning',
  DELETE: 'destructive',
  RESTORE: 'info',
  REVOKE_SESSION: 'destructive',
  PASSWORD_CHANGE: 'info',
  PASSWORD_RESET: 'warning',
  PASSWORD_RESET_REQUEST: 'info',
};

export function AuditLogsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
}: AuditLogsTableProps) {
  const router = useRouter();

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

  // Avoid hydration mismatch by only rendering after mount.
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

  const isSearching = !!(searchValue && searchValue.trim() !== '');
  const isFilteringByDate = !!(dateFilter?.start || dateFilter?.end);
  const isFiltering = isSearching || isFilteringByDate;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue, dateFilter]);

  const {
    data: auditLogList,
    isPending: isAuditLogListPending,
    error: auditLogListError,
  } = useQuery({
    queryKey: [
      'find-audit-logs',
      pagination,
      searchValue,
      selectedFilterOption,
      sorting,
      dateFilter,
    ],
    queryFn: async () => {
      if (!mounted) {
        return {
          success: true,
          data: { items: [], total: 0 },
        } as ActionResponse<FindAuditLogsOutput>;
      }

      return await findAuditLogs({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: sorting[0]?.id,
        orderDir: sorting[0]?.desc ? 'desc' : 'asc',
        search: isSearching ? searchValue : undefined,
        searchBy: isSearching ? selectedFilterOption : undefined,
        startDate: dateFilter?.start,
        endDate: dateFilter?.end,
        timezoneOffset: getTimezoneOffset(),
        includeRelatedUsers: true,
        includeDeleted: false,
      });
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const auditLogs = useMemo(() => {
    if (auditLogList?.success) {
      return auditLogList.data.items;
    }
    if (auditLogList && !auditLogList.success) {
      logger.error('Error fetching audit logs:', auditLogListError);
    }
    return [];
  }, [auditLogList, auditLogListError]);

  const relatedUsers = useMemo(() => {
    if (auditLogList?.success) {
      return auditLogList.data.relatedUsers;
    }
    return [];
  }, [auditLogList]);

  const columns = useMemo<ColumnDef<Partial<AuditLog>>[]>(() => {
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
                    column.toggleSorting(next === 'desc');
                    if (next === false) {
                      setSorting([]);
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
                  {renderOrFallback(row.getValue(column.id), (value) => (
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
          ] as ColumnDef<Partial<AuditLog>>[])
        : []),
      {
        accessorKey: 'userId',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
        cell: ({ row, column }) => {
          const user = findRecordById(
            relatedUsers || [],
            row.getValue(column.id) as string
          );
          if (!user) {
            return renderOrFallback(null, (value) => value);
          }

          return (
            <UserPreviewDialog
              user={user as User}
              title="Detalhes do autor"
              description="Informações sobre o usuário que realizou esta ação."
            >
              <Button
                variant="ghost"
                size="sm"
                className={`px-1! select-none cursor-pointer ml-1 truncate ${COLUMN_MAX_WIDTH}`}
              >
                <HighlightedText
                  text={user.name}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              </Button>
            </UserPreviewDialog>
          );
        },
      },
      {
        accessorKey: 'action',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
              <Badge variant={ACTION_VARIANTS[value as string] || 'default'}>
                <HighlightedText
                  text={ACTION_LABELS[value as Action] || String(value)}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              </Badge>
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'entityName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
                text={ENTITY_LABELS[value as string] || String(value)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'entityId',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
        cell: ({ row, column }) => {
          const entityId = row.getValue(column.id) as string;
          const entityName = row.original.entityName as EntityName;

          if (!entityId || !entityName) {
            return (
              <div
                className={`ml-1 truncate font-mono text-xs text-muted-foreground ${COLUMN_MAX_WIDTH}`}
              >
                {renderOrFallback(entityId, (value) => (
                  <HighlightedText
                    text={String(value)}
                    highlight={
                      selectedFilterOption === column.id ? searchValue : ''
                    }
                  />
                ))}
              </div>
            );
          }

          return (
            <EntityPreviewWrapper entityId={entityId} entityName={entityName}>
              <Button
                variant="ghost"
                size="sm"
                className={`px-1! select-none cursor-pointer ml-1 truncate font-mono text-xs text-muted-foreground ${COLUMN_MAX_WIDTH}`}
              >
                <HighlightedText
                  text={entityId}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              </Button>
            </EntityPreviewWrapper>
          );
        },
      },
      {
        accessorKey: 'oldValues',
        header: ({ column }) => (
          <span
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
          </span>
        ),
        cell: ({ row, column }) => {
          const value = row.getValue(column.id);
          const stringifiedValue = value ? JSON.stringify(value) : '';

          return (
            <div
              className={`ml-1 truncate font-mono text-xs text-muted-foreground ${COLUMN_MAX_WIDTH}`}
            >
              {renderOrFallback(value, () => (
                <HighlightedText
                  text={stringifiedValue}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              ))}
            </div>
          );
        },
      },
      {
        accessorKey: 'newValues',
        header: ({ column }) => (
          <span
            className={`px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            {COLUMN_LABELS[column.id]}
          </span>
        ),
        cell: ({ row, column }) => {
          const value = row.getValue(column.id);
          const stringifiedValue = value ? JSON.stringify(value) : '';

          return (
            <div
              className={`ml-1 truncate font-mono text-xs text-muted-foreground ${COLUMN_MAX_WIDTH}`}
            >
              {renderOrFallback(value, () => (
                <HighlightedText
                  text={stringifiedValue}
                  highlight={
                    selectedFilterOption === column.id ? searchValue : ''
                  }
                />
              ))}
            </div>
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
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
                text={String(value)}
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
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
                text={String(value)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
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
              column.toggleSorting(next === 'desc');
              if (next === false) {
                setSorting([]);
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
                  text={String(value)}
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
                    router.push(`/audit-logs/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [showIdColumn, selectedFilterOption, searchValue, relatedUsers, router]);

  const table = useReactTable({
    data: auditLogs,
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
    pageCount: auditLogList?.success
      ? Math.ceil(auditLogList.data.total / pagination.pageSize)
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
    exportToCsv(rows, 'audit-logs-export');
  }

  if (!mounted) {
    return null;
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData =
    auditLogList?.success && (auditLogList.data.total ?? 0) > 0;

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

      {isAuditLogListPending ? (
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
                    router.push(`/audit-logs/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>
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
        <EmptyTableFeedback variant="audit-logs" />
      )}
    </div>
  );
}
