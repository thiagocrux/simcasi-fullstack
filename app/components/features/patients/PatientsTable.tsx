'use client';

import { Patient, User } from '@prisma/client';
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

type Column =
  | 'id'
  | 'susCardNumber'
  | 'name'
  | 'cpf'
  | 'socialName'
  | 'birthDate'
  | 'race'
  | 'sex'
  | 'gender'
  | 'sexuality'
  | 'nationality'
  | 'schooling'
  | 'phone'
  | 'email'
  | 'motherName'
  | 'fatherName'
  | 'isDeceased'
  | 'monitoringType'
  | 'zipCode'
  | 'state'
  | 'city'
  | 'neighborhood'
  | 'street'
  | 'houseNumber'
  | 'complement'
  | 'createdAt'
  | 'createdBy'
  | 'updatedBy'
  | 'updatedAt';

const COLUMN_LABELS: Record<Column, string> = {
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

const FILTERABLE_COLUMNS: Column[] = [
  'name',
  'socialName',
  'cpf',
  'susCardNumber',
  'motherName',
];
const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';
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
  const [selectedFilterOption, setSelectedFilterOption] = useState<Column>(
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
                    if (next === false) setSorting([]);
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
                  <HighlightedText
                    text={String(row.original.id)}
                    highlight={selectedFilterOption === 'id' ? searchValue : ''}
                  />
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Número do cartão do SUS
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('susCardNumber'), (value) => (
              <HighlightedText
                text={applyMask(value, 'susCardNumber')}
                highlight={
                  selectedFilterOption === 'susCardNumber' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            CPF
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('cpf'), (value) => (
              <HighlightedText
                text={applyMask(value, 'cpf')}
                highlight={selectedFilterOption === 'cpf' ? searchValue : ''}
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
              if (next === false) setSorting([]);
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
        accessorKey: 'socialName',
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
            Nome social
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
            {renderOrFallback(row.getValue('socialName'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'socialName' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Data de nascimento
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
              formatCalendarDate(row.getValue('birthDate') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={
                    selectedFilterOption === 'birthDate' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Raça
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
            {renderOrFallback(row.getValue('race'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'race' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Sexo
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
            {renderOrFallback(row.getValue('sex'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'sex' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Gênero
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
            {renderOrFallback(row.getValue('gender'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'gender' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Sexualidade
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
            {renderOrFallback(row.getValue('sexuality'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'sexuality' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Nacionalidade
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
            {renderOrFallback(row.getValue('nationality'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'nationality' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Escolaridade
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
            {renderOrFallback(row.getValue('schooling'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'schooling' ? searchValue : ''
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
              if (next === false) setSorting([]);
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
        accessorKey: 'motherName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => {
              const next = getNextSortDirection(column.getIsSorted());
              column.toggleSorting(next === 'desc');
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Nome da mãe
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
            {renderOrFallback(row.getValue('motherName'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'motherName' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Nome do pai
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
            {renderOrFallback(row.getValue('fatherName'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'fatherName' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Falecido?
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
              text={row.getValue('isDeceased') ? 'Sim' : 'Não'}
              highlight={
                selectedFilterOption === 'isDeceased' ? searchValue : ''
              }
            />
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Tipo de monitoramento
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
            {renderOrFallback(row.getValue('monitoringType'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'monitoringType' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Telefone
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
            {renderOrFallback(row.getValue('phone'), (value) => (
              <HighlightedText
                text={applyMask(value, 'phone')}
                highlight={selectedFilterOption === 'phone' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            CEP
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('zipCode'), (value) => (
              <HighlightedText
                text={applyMask(value, 'zipCode')}
                highlight={
                  selectedFilterOption === 'zipCode' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Estado
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
            {renderOrFallback(row.getValue('state'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'state' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Cidade
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
            {renderOrFallback(row.getValue('city'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'city' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Bairro
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
            {renderOrFallback(row.getValue('neighborhood'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'neighborhood' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Rua
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
            {renderOrFallback(row.getValue('street'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'street' ? searchValue : ''}
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Número
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDown01 />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUp10 />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className={`ml-1 truncate ${COLUMN_MAX_WIDTH}`}>
            {renderOrFallback(row.getValue('houseNumber'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'houseNumber' ? searchValue : ''
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
              if (next === false) setSorting([]);
            }}
            className={`px-1! cursor-pointer ${COLUMN_MAX_WIDTH}`}
          >
            Complemento
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
            {renderOrFallback(row.getValue('complement'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'complement' ? searchValue : ''
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
              if (next === false) setSorting([]);
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
              column.toggleSorting(next === 'desc');
              if (next === false) setSorting([]);
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
              column.toggleSorting(next === 'desc');
              if (next === false) setSorting([]);
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
              column.toggleSorting(next === 'desc');
              if (next === false) setSorting([]);
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
            setSelectedFilterOption(value as Column)
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
