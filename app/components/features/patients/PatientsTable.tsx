'use client';

import { Patient } from '@/core/domain/entities/patient.entity';
import { User } from '@/core/domain/entities/user.entity';
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
  ArrowDown01,
  ArrowDownAZ,
  ArrowUp10,
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

import { deletePatient, findPatients } from '@/app/actions/patient.actions';
import { FindPatientsOutput } from '@/core/application/contracts/patient/find-patients.contract';
import { usePermission } from '@/hooks/usePermission';
import { ActionResponse } from '@/lib/actions.utils';
import { exportToCsv } from '@/lib/csv.utils';
import {
  applyMask,
  formatCalendarDate,
  formatDate,
} from '@/lib/formatters.utils';
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

interface PatientsTableProps {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
  showIdColumn?: boolean;
}

const COLUMN_LABELS: Record<string, string> = {
  id: 'ID',
  susCardNumber: 'Número do cartão do SUS',
  name: 'Nome',
  cpf: 'CPF',
  socialName: 'Nome social',
  birthDate: 'Data de nascimento',
  race: 'Raça',
  sex: 'Sexo',
  gender: 'Gênero',
  sexuality: 'Sexualidade',
  nationality: 'Nacionalidade',
  schooling: 'Escolaridade',
  phone: 'Telefone',
  email: 'E-mail',
  motherName: 'Nome da mãe',
  fatherName: 'Nome do pai',
  isDeceased: 'Falecido?',
  monitoringType: 'Tipo de monitoramento',
  zipCode: 'CEP',
  state: 'Estado',
  city: 'Cidade',
  neighborhood: 'Bairro',
  street: 'Rua',
  houseNumber: 'Número',
  complement: 'Complemento',
  createdAt: 'Criado em',
  createdBy: 'Criado por',
  updatedBy: 'Atualizado por',
  updatedAt: 'Atualizado em',
};

const FILTERABLE_COLUMNS: string[] = [
  'name',
  'socialName',
  'cpf',
  'susCardNumber',
  'motherName',
];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN = 'name';
const COLUMN_MAX_WIDTH = 'max-w-md';

export function PatientsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
  showIdColumn = true,
}: PatientsTableProps) {
  const router = useRouter();
  const { can } = usePermission();

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

  const isSearching = searchValue.trim() !== '';
  const isFilteringByDate = !!(dateFilter?.start || dateFilter?.end);
  const isFiltering = isSearching || isFilteringByDate;

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue, dateFilter]);

  const {
    data: patientList,
    refetch: refetchPatientList,
    isPending: isPatientListPending,
    error: patientListError,
  } = useQuery({
    queryKey: [
      'find-patients',
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
        } as ActionResponse<FindPatientsOutput>;
      }

      return await findPatients({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: sorting[0]?.id,
        orderDir: sorting[0]?.desc ? 'desc' : 'asc',
        search: searchValue,
        searchBy: selectedFilterOption,
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

  const patients = useMemo(() => {
    if (patientList?.success) {
      return patientList.data.items;
    }
    if (patientList && !patientList.success) {
      logger.error('Error fetching patients:', patientListError);
    }
    return [];
  }, [patientList, patientListError]);

  const relatedUsers = useMemo(() => {
    if (patientList?.success) {
      return patientList.data.relatedUsers;
    }
    return [];
  }, [patientList]);

  const handleDelete = useCallback(
    (id: string) => {
      deletePatient(id);
      refetchPatientList();
    },
    [refetchPatientList]
  );

  const columns = useMemo<ColumnDef<Partial<Patient>>[]>(() => {
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
          ] as ColumnDef<Partial<Patient>>[])
        : []),
      {
        accessorKey: 'susCardNumber',
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
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue(column.id), (value) => (
              <HighlightedText
                text={applyMask(String(value), column.id)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'cpf',
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
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue(column.id), (value) => (
              <HighlightedText
                text={applyMask(String(value), column.id)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'name',
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
        accessorKey: 'socialName',
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
        accessorKey: 'birthDate',
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
              formatCalendarDate(row.getValue(column.id) as Date),
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
        accessorKey: 'race',
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
        accessorKey: 'sex',
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
        accessorKey: 'gender',
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
        accessorKey: 'sexuality',
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
        accessorKey: 'nationality',
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
        accessorKey: 'schooling',
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
        accessorKey: 'email',
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
        accessorKey: 'motherName',
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
        accessorKey: 'fatherName',
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
        accessorKey: 'isDeceased',
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
                text={value ? 'Sim' : 'Não'}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'monitoringType',
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
        accessorKey: 'phone',
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
                text={applyMask(String(value), column.id)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'zipCode',
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
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row, column }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue(column.id), (value) => (
              <HighlightedText
                text={applyMask(String(value), column.id)}
                highlight={
                  selectedFilterOption === column.id ? searchValue : ''
                }
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'state',
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
        accessorKey: 'city',
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
        accessorKey: 'neighborhood',
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
        accessorKey: 'street',
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
        accessorKey: 'houseNumber',
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
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
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
        accessorKey: 'complement',
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
        accessorKey: 'createdBy',
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
              title="Informações do criador"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              user={user as User}
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
        accessorKey: 'updatedBy',
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
              title="Informações do editor"
              description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
              user={user as User}
            >
              <Button
                variant="ghost"
                size="sm"
                className={`ml-1 truncate px-1! select-none cursor-pointer ${COLUMN_MAX_WIDTH}`}
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
        accessorKey: 'updatedAt',
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
                    router.push(`/patients/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>

                {can('update:patient') && (
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/patients/${row.original.id}`)}
                  >
                    <Pen />
                    Editar paciente
                  </DropdownMenuItem>
                )}

                {can('delete:patient') && (
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
                      Deletar paciente
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
    can,
    router,
    handleDelete,
  ]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: patients,
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
    pageCount: patientList?.success
      ? Math.ceil(patientList.data.total / pagination.pageSize)
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
    exportToCsv(rows, 'patients-export');
  }

  if (!mounted) {
    return null;
  }

  const hasRows = !!table.getRowModel().rows?.length;
  const hasRegisteredData =
    patientList?.success && (patientList.data.total ?? 0) > 0;

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
        >
          {can('create:patient') && (
            <Button
              variant="outline"
              className="self-end cursor-pointer select-none"
              onClick={() => router.push('patients/new')}
            >
              <Plus />
              Cadastrar paciente
            </Button>
          )}
        </AppTableToolbar>
      )}

      {isPatientListPending ? (
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
                    router.push(`/patients/${row.original.id}/details`)
                  }
                >
                  <Eye className="mr-2 w-4 h-4" /> Ver detalhes
                </ContextMenuItem>

                {can('update:patient') && (
                  <ContextMenuItem
                    className="cursor-pointer"
                    onClick={() => router.push(`/patients/${row.original.id}`)}
                  >
                    <Pen className="mr-2 w-4 h-4" />
                    Editar paciente
                  </ContextMenuItem>
                )}

                {can('delete:patient') && (
                  <>
                    <ContextMenuSeparator />
                    <AppAlertDialog
                      title="Você tem certeza absoluta?"
                      description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o paciente."
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
                        Deletar paciente
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
        <EmptyTableFeedback variant="patients" />
      )}
    </div>
  );
}
