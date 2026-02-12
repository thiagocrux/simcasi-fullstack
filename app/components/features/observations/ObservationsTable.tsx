'use client';

import { NewMedicalRecordDialog } from '@/app/components/common/NewMedicalRecordDialog';
import { Observation } from '@prisma/client';
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
  deleteObservation,
  findObservations,
} from '@/app/actions/observation.actions';

import { FindObservationsOutput } from '@/core/application/contracts/observation/find-observations.contract';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';
import { usePermission } from '@/hooks/usePermission';
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
import { HighlightedText } from '../../common/HighlightedText';
import { Button } from '../../ui/button';
import { ContextMenuItem, ContextMenuSeparator } from '../../ui/context-menu';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { PatientPreviewDialog } from '../patients/PatientPreviewDialog';
import { UserPreviewDialog } from '../users/UserPreviewDialog';

interface ObservationsTableProps {
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
  | 'observations'
  | 'hasPartnerBeingTreated'
  | 'createdBy'
  | 'createdAt'
  | 'updatedBy'
  | 'updatedAt';

const COLUMN_LABELS: Record<Column, string> = {
  id: 'ID',
  patientId: 'Paciente',
  observations: 'Observações',
  hasPartnerBeingTreated: 'Parceiro sendo tratado?',
  createdBy: 'Criado por',
  createdAt: 'Criado em',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS: Column[] = ['observations'];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'observations';
const COLUMN_MAX_WIDTH = 'max-w-md';

export function ObservationsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
  patientId,
}: ObservationsTableProps) {
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
    data: observationList,
    refetch: refetchObservationList,
    isPending: isObservationListPending,
    error: observationListError,
  } = useQuery({
    queryKey: [
      'find-observations',
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
        } as ActionResponse<FindObservationsOutput>;
      }

      return await findObservations({
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

  const observations = useMemo(() => {
    if (observationList?.success) {
      return observationList.data.items;
    }
    if (observationList && !observationList.success) {
      logger.error('Error fetching patients:', observationListError);
    }
    return [];
  }, [observationList, observationListError]);

  const relatedUsers = useMemo(() => {
    if (observationList?.success) {
      return observationList.data.relatedUsers;
    }
    return [];
  }, [observationList]);

  const relatedPatients = useMemo(() => {
    if (observationList?.success) {
      return observationList.data.relatedPatients;
    }
    return [];
  }, [observationList]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteObservation(id);
      refetchObservationList();
    },
    [refetchObservationList]
  );

  const columns = useMemo<ColumnDef<Partial<Observation>>[]>(() => {
    return [
      ...(showIdColumn
        ? ([
            {
              accessorKey: 'id' as Column,
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
                  {renderOrFallback(row.original.id, (value) => (
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
          ] as ColumnDef<Partial<Observation>>[])
        : []),
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
        accessorKey: 'hasPartnerBeingTreated',
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            <HighlightedText
              text={row.getValue('hasPartnerBeingTreated') ? 'Sim' : 'Não'}
              highlight={
                selectedFilterOption === 'hasPartnerBeingTreated'
                  ? searchValue
                  : ''
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
        cell: ({ row }) => {
          const patient = findRecordById(
            relatedPatients || [],
            row.getValue('patientId')
          );

          return (
            <PatientPreviewDialog
              title="Informações do paciente"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              patient={patient as Patient}
            >
              <Button
                variant="link"
                size="sm"
                className={`px-0! ml-1 truncate cursor-pointer ${COLUMN_MAX_WIDTH}`}
              >
                {patient?.name}
              </Button>
            </PatientPreviewDialog>
          );
        },
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
        cell: ({ row }) => {
          const user = findRecordById(
            relatedUsers || [],
            row.getValue('createdBy')
          );

          return (
            <UserPreviewDialog
              title="Informações do criador"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              user={user as Omit<User, 'password'>}
            >
              <Button
                variant="link"
                size="sm"
                className={`px-0! ml-1 truncate cursor-pointer ${COLUMN_MAX_WIDTH}`}
              >
                {user?.name}
              </Button>
            </UserPreviewDialog>
          );
        },
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
        cell: ({ row }) => {
          const user = findRecordById(
            relatedUsers || [],
            row.getValue('updatedBy')
          );

          return (
            <UserPreviewDialog
              title="Informações do editor"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              user={user as Omit<User, 'password'>}
            >
              <Button
                variant="link"
                size="sm"
                className={`px-0! ml-1 truncate cursor-pointer ${COLUMN_MAX_WIDTH}`}
              >
                {user?.name}
              </Button>
            </UserPreviewDialog>
          );
        },
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
                <Button variant="ghost" className="p-0 w-8 h-8 cursor-pointer">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/observations/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>

                {can('update:observation') && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/observations/${row.original.id}`
                      )
                    }
                  >
                    <Pen />
                    Editar observação
                  </DropdownMenuItem>
                )}

                {can('delete:observation') && (
                  <AppAlertDialog
                    title="Você tem certeza absoluta?"
                    description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
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
                      Deletar observação
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
    relatedPatients,
    relatedUsers,
    can,
    router,
    handleDelete,
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: observations,
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
    pageCount: observationList?.success
      ? Math.ceil(observationList.data.total / pagination.pageSize)
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
    exportToCsv(rows, 'observations-export');
  }

  if (!mounted) {
    return null;
  }

  const hasRows = table.getRowModel().rows.length > 0;
  const hasRegisteredData =
    observationList?.success && (observationList.data.total ?? 0) > 0;

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
          {can('create:observation') && (
            <NewMedicalRecordDialog variant="observations">
              <Button
                variant="outline"
                className="self-end cursor-pointer select-none"
              >
                <Plus />
                Cadastrar observação
              </Button>
            </NewMedicalRecordDialog>
          )}
        </AppTableToolbar>
      )}

      {isObservationListPending ? (
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
                    router.push(`/observations/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>

                {can('update:observation') && (
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/observations/${row.original.id}`
                      )
                    }
                  >
                    <Pen className="mr-2 w-4 h-4" />
                    Editar observação
                  </ContextMenuItem>
                )}

                {can('delete:observation') && (
                  <>
                    <ContextMenuSeparator />
                    <AppAlertDialog
                      title="Você tem certeza absoluta?"
                      description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
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
                        Deletar observação
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
        <EmptyTableFeedback variant="observations" patientId={patientId} />
      )}
    </div>
  );
}
