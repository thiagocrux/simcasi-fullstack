'use client';

import { Exam } from '@prisma/client';
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

import { deleteExam, findExams } from '@/app/actions/exam.actions';
import { FindExamsOutput } from '@/core/application/contracts/exam/find-exams.contract';
import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';
import { usePermission } from '@/hooks/usePermission';
import { ActionResponse } from '@/lib/actions.utils';
import { exportToCsv } from '@/lib/csv.utils';
import { formatCalendarDate, formatDate } from '@/lib/formatters.utils';
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
import { NewMedicalRecordDialog } from '../../common/NewMedicalRecordDialog';
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

interface ExamsTableProps {
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
  | 'updatedBy'
  | 'updatedAt';

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
  otherNontreponemalTestDate: 'Data do outro teste não treponêmico',
  referenceObservations: 'Observações de referência',
  createdBy: 'Criado por',
  createdAt: 'Criado em',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS: Column[] = [
  'treponemalTestType',
  'treponemalTestLocation',
  'nontreponemalTestTitration',
  'referenceObservations',
];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'treponemalTestType';
const COLUMN_MAX_WIDTH = 'max-w-md';

export function ExamsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
  patientId,
}: ExamsTableProps) {
  const router = useRouter();
  const { can } = usePermission();

  const [mounted, setMounted] = useState(false);
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
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const searchValue = useMemo(() => {
    const filter = columnFilters.find((f) => f.id === selectedFilterOption);
    return (filter?.value as string) ?? '';
  }, [columnFilters, selectedFilterOption]);

  const dateFilter = useMemo(() => {
    const filter = columnFilters.find((f) => f.id === 'createdAt');
    return filter?.value as { start?: string; end?: string } | undefined;
  }, [columnFilters]);

  const isSearching = searchValue.trim() !== '';
  const isFilteringByDate = !!(dateFilter?.start || dateFilter?.end);
  const isFiltering = isSearching || isFilteringByDate;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue, dateFilter]);

  const {
    data: examList,
    refetch: refetchExamList,
    isPending: isExamListPending,
    error: examListError,
  } = useQuery({
    queryKey: [
      'find-exams',
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
        } as ActionResponse<FindExamsOutput>;
      }

      return await findExams({
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

  const exams = useMemo(() => {
    if (examList?.success) {
      return examList.data.items;
    }
    if (examList && !examList.success) {
      logger.error('Error fetching patients:', examListError);
    }
    return [];
  }, [examList, examListError]);

  const relatedUsers = useMemo(() => {
    if (examList?.success) {
      return examList.data.relatedUsers;
    }
    return [];
  }, [examList]);

  const relatedPatients = useMemo(() => {
    if (examList?.success) {
      return examList.data.relatedPatients;
    }
    return [];
  }, [examList]);

  const handleDelete = useCallback(
    (id: string) => {
      deleteExam(id);
      refetchExamList();
    },
    [refetchExamList]
  );

  const columns = useMemo<ColumnDef<Partial<Exam>>[]>(() => {
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
          ] as ColumnDef<Partial<Exam>>[])
        : []),
      {
        accessorKey: 'treponemalTestType',
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('treponemalTestType'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'treponemalTestType'
                    ? searchValue
                    : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('treponemalTestResult'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'treponemalTestResult'
                    ? searchValue
                    : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              formatCalendarDate(row.getValue('treponemalTestDate')),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'treponemalTestDate'
                      ? searchValue
                      : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue('treponemalTestLocation'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'treponemalTestLocation'
                      ? searchValue
                      : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue('nontreponemalVdrlTest'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'nontreponemalVdrlTest'
                      ? searchValue
                      : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue('nontreponemalTestTitration'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'nontreponemalTestTitration'
                      ? searchValue
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              formatCalendarDate(row.getValue('nontreponemalTestDate')),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'nontreponemalTestDate'
                      ? searchValue
                      : ''
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue('otherNontreponemalTest'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'otherNontreponemalTest'
                      ? searchValue
                      : ''
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
            Data do outro teste não treponêmico
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
              formatCalendarDate(row.getValue('otherNontreponemalTestDate')),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'otherNontreponemalTestDate'
                      ? searchValue
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
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(
              row.getValue('referenceObservations'),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'referenceObservations'
                      ? searchValue
                      : ''
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
                <Button variant="ghost" className="p-0 w-8 h-8">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/exams/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>

                {can('delete:exam') && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/exams/${row.original.id}`
                      )
                    }
                  >
                    <Pen />
                    Editar exame
                  </DropdownMenuItem>
                )}

                {can('delete:exam') && (
                  <AppAlertDialog
                    title="Você tem certeza absoluta?"
                    description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o exame."
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
                      Deletar exame
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
    data: exams,
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
    pageCount: examList?.success
      ? Math.ceil(examList.data.total / pagination.pageSize)
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
    exportToCsv(rows, 'exams-export');
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData = examList?.success && (examList.data.total ?? 0) > 0;

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
          {can('create:exam') && (
            <NewMedicalRecordDialog variant="exams">
              <Button
                variant="outline"
                className="self-end cursor-pointer select-none"
              >
                <Plus />
                Cadastrar exame
              </Button>
            </NewMedicalRecordDialog>
          )}
        </AppTableToolbar>
      )}

      {isExamListPending ? (
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
                    router.push(`/exams/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>

                {can('update:exam') && (
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() =>
                      router.push(
                        `/patients/${row.original.patientId}/exams/${row.original.id}`
                      )
                    }
                  >
                    <Pen className="mr-2 w-4 h-4" />
                    Editar exame
                  </ContextMenuItem>
                )}

                {can('delete:exam') && (
                  <>
                    <ContextMenuSeparator />
                    <AppAlertDialog
                      title="Você tem certeza absoluta?"
                      description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o exame."
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
                        Deletar exame
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
        <EmptyTableFeedback variant="exams" patientId={patientId} />
      )}
    </div>
  );
}
