'use client';

import { Notification } from '@prisma/client';
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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EmptyTableFeedback } from '../../common/EmptyTableFeedback';

import {
  deleteNotification,
  findNotifications,
} from '@/app/actions/notification.actions';

import { usePermission } from '@/hooks/usePermission';
import { exportToCsv } from '@/lib/csv.utils';
import { formatDate } from '@/lib/formatters.utils';
import { getTimezoneOffset, renderOrFallback } from '@/lib/shared.utils';
import { getNextSortDirection } from '@/lib/sort.utils';
import { AppAlertDialog } from '../../common/AppAlertDialog';
import { AppTable } from '../../common/AppTable';
import { AppTablePagination } from '../../common/AppTablePagination';
import { AppTableToolbar } from '../../common/AppTableToolbar';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { HighlightedText } from '../../common/HighlightedText';
import { NewMedicalRecordDialog } from '../../common/NewMedicalRecordDialog';
import { Button } from '../../ui/button';
import { ContextMenuItem, ContextMenuSeparator } from '../../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';

interface NotificationsTableProps {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
  showIdColumn?: boolean;
  patientId?: string;
}

type Column =
  | 'id'
  | 'patientId'
  | 'sinan'
  | 'observations'
  | 'createdBy'
  | 'createdAt'
  | 'updatedBy'
  | 'updatedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  patientId: 'Paciente',
  sinan: 'SINAN',
  observations: 'Observações',
  createdAt: 'Criado em',
  createdBy: 'Criado por',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS: Column[] = ['sinan', 'observations'];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'sinan';
const COLUMN_MAX_WIDTH = 'max-w-md';

export function NotificationsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
  patientId,
}: NotificationsTableProps) {
  const router = useRouter();
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
    data: notificationList,
    refetch: refetchNotificationList,
    isPending,
  } = useQuery({
    queryKey: [
      'find-notifications',
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

      return await findNotifications({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: sorting[0]?.id,
        orderDir: sorting[0]?.desc ? 'desc' : 'asc',
        search: searchValue,
        searchBy: selectedFilterOption,
        patientId,
        includeDeleted: false,
        startDate: dateFilter?.start,
        endDate: dateFilter?.end,
        timezoneOffset: getTimezoneOffset(),
        includeRelatedPatients: true,
        includeRelatedUsers: true,
      });
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const notifications = useMemo(() => {
    if (notificationList?.success) {
      return notificationList.data.items;
    }
    return [];
  }, [notificationList]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteNotification(id);
      refetchNotificationList();
    },
    [refetchNotificationList]
  );

  const columns = useMemo<ColumnDef<Partial<Notification>>[]>(() => {
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
                      text={String(value)}
                      highlight={
                        selectedFilterOption === 'id' ? searchValue : ''
                      }
                    />
                  ))}
                </div>
              ),
            },
          ] as ColumnDef<Partial<Notification>>[])
        : []),
      {
        accessorKey: 'sinan',
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
            SINAN
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
            {renderOrFallback(row.getValue('sinan'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'sinan' ? searchValue : ''}
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('observations'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'observations' ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'patientId',
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('patientId'), (value) => (
              <HighlightedText
                text={String(value)}
                highlight={
                  selectedFilterOption === 'patientId' ? searchValue : ''
                }
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
                text={String(value)}
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
                    router.push(`/notifications/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                {can('update:notification') && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/notifications/${row.original.id}`
                      )
                    }
                  >
                    <Pen />
                    Editar notificação
                  </DropdownMenuItem>
                )}

                {can('delete:notification') && (
                  <AppAlertDialog
                    title="Você tem certeza absoluta?"
                    description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a notificação."
                    cancelAction={{ action: () => {} }}
                    continueAction={{
                      action: () => handleDelete(String(row.original.id)),
                    }}
                  >
                    <DropdownMenuItem
                      className="text-destructive cursor-pointer"
                      onSelect={(event) => event.preventDefault()}
                    >
                      <Trash2 />
                      Deletar notificação
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
    can,
    router,
    handleDelete,
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: notifications,
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
    pageCount: notificationList?.success
      ? Math.ceil(notificationList.data.total / pagination.pageSize)
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
    exportToCsv(rows, 'notifications-export');
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData =
    notificationList?.success && (notificationList.data.total ?? 0) > 0;

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
          {can('create:notification') && (
            <NewMedicalRecordDialog variant="notifications">
              <Button
                variant="outline"
                className="self-end cursor-pointer select-none"
              >
                <Plus />
                Cadastrar notificação
              </Button>
            </NewMedicalRecordDialog>
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
                    router.push(`/notifications/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>

                {can('update:notification') && (
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/notifications/${row.original.id}`
                      )
                    }
                  >
                    <Pen className="mr-2 w-4 h-4" />
                    Editar notificação
                  </ContextMenuItem>
                )}

                {can('delete:notification') && (
                  <>
                    <ContextMenuSeparator />
                    <AppAlertDialog
                      title="Você tem certeza absoluta?"
                      description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a notificação."
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
                        Deletar notificação
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
        <EmptyTableFeedback variant="notifications" patientId={patientId} />
      )}
    </div>
  );
}
