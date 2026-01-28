'use client';

import { Patient } from '@prisma/client';
import { useQuery } from '@tanstack/react-query';
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
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { deletePatient, findPatients } from '@/app/actions/patient.actions';

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

interface PatientsTable {
  pageSize?: number;
  showFilterInput?: boolean;
  showPrintButton?: boolean;
  showColumnToggleButton?: boolean;
  showPaginationInput?: boolean;
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
  'cpf',
  'susCardNumber',
  'motherName',
  'email',
  'phone',
  'city',
  'state',
];

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';

export function PatientsTable({
  pageSize = DEFAULT_PAGE_SIZE,
  showFilterInput = true,
  showPrintButton = true,
  showColumnToggleButton = true,
  showPaginationInput = false,
}: PatientsTable) {
  const router = useRouter();

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

  const { data: patientList } = useQuery({
    queryKey: ['find-patients', pagination, searchValue, sorting],
    queryFn: async () =>
      await findPatients({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        orderBy: sorting[0]?.id,
        orderDir: sorting[0]?.desc ? 'desc' : 'asc',
        search: searchValue,
        includeDeleted: false,
      }),
  });

  const patients = useMemo(() => {
    if (patientList?.success) {
      return patientList.data.items;
    }
    return [];
  }, [patientList]);

  const handleDelete = useCallback((id: string) => {
    deletePatient(id);
  }, []);

  const columns = useMemo<ColumnDef<Partial<Patient>>[]>(() => {
    return [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            ID
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            <HighlightedText
              text={String(row.getValue('id'))}
              highlight={selectedFilterOption === 'id' ? searchValue : ''}
            />
          </div>
        ),
      },
      {
        accessorKey: 'susCardNumber',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
            {renderOrFallback(row.getValue('susCardNumber'), (value) => (
              <HighlightedText
                text={value}
                highlight={
                  selectedFilterOption === 'susCardNumber' ? searchValue : ''
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
        accessorKey: 'cpf',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
            {renderOrFallback(row.getValue('cpf'), (value) => (
              <HighlightedText
                text={value}
                highlight={selectedFilterOption === 'cpf' ? searchValue : ''}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
            {renderOrFallback(
              formatDate(row.getValue('birthDate') as Date),
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
        accessorKey: 'motherName',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
            {renderOrFallback(row.getValue('phone'), (value) => (
              <HighlightedText
                text={value}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            CEP
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
            {renderOrFallback(row.getValue('zipCode'), (value) => (
              <HighlightedText
                text={value}
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Número
            {column.getSortIndex() === 0 && column.getIsSorted() === 'asc' && (
              <ArrowDownAZ />
            )}
            {column.getSortIndex() === 0 && column.getIsSorted() === 'desc' && (
              <ArrowUpZA />
            )}
          </Button>
        ),
        cell: ({ row }) => (
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
          <div className="ml-1">
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
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
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
                    router.push(`/patients/${row.original.id}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(`/patients/${row.original.id}`)}
                >
                  <Pen />
                  Editar paciente
                </DropdownMenuItem>
                <AppAlertDialog
                  title="Você tem certeza absoluta?"
                  description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
                  cancelAction={{ action: () => {} }}
                  continueAction={{
                    action: () => handleDelete(String(row.original.id)),
                  }}
                >
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onSelect={(event) => event.preventDefault()}
                  >
                    <Trash2 />
                    Deletar paciente
                  </DropdownMenuItem>
                </AppAlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      },
    ];
  }, [selectedFilterOption, searchValue, router, handleDelete]);

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

      {patients.length > 0 ? (
        <AppTablePagination
          table={table}
          showPaginationInput={showPaginationInput}
        />
      ) : null}
    </div>
  );
}
