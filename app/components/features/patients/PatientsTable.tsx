'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

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

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';

import { exportToCsv } from '@/lib/exportToCsv';
import { formatDate } from '@/lib/formatters';
import { renderOrFallback } from '@/lib/utils';
import { Patient } from '@/prisma/generated/client';
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
  data: Patient[];
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
  | 'updatedAt'
  | 'deletedAt';

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
  updatedAt: 'Atualizado em',
  deletedAt: 'Deletado em',
};

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_FILTER_COLUMN: Column = 'name';

export function PatientsTable({
  data,
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

  const [filterOption, setFilterOption] = useState<Column>(
    DEFAULT_FILTER_COLUMN
  );

  // TODO: Implement real delete functionality.
  function handleDelete() {
    console.log(`Delete called for ID: ${data[0].id}`);
  }

  const columns = useMemo<ColumnDef<Partial<Patient>>[]>(() => {
    const filterValue =
      (columnFilters.find((filter) => filter.id === filterOption)
        ?.value as string) ?? '';

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
              highlight={filterOption === 'id' ? filterValue : ''}
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
                highlight={filterOption === 'susCardNumber' ? filterValue : ''}
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
                highlight={filterOption === 'name' ? filterValue : ''}
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
                highlight={filterOption === 'cpf' ? filterValue : ''}
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
                highlight={filterOption === 'socialName' ? filterValue : ''}
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
                  highlight={filterOption === 'birthDate' ? filterValue : ''}
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
                highlight={filterOption === 'race' ? filterValue : ''}
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
                highlight={filterOption === 'sex' ? filterValue : ''}
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
                highlight={filterOption === 'gender' ? filterValue : ''}
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
                highlight={filterOption === 'sexuality' ? filterValue : ''}
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
                highlight={filterOption === 'nationality' ? filterValue : ''}
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
                highlight={filterOption === 'schooling' ? filterValue : ''}
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
                highlight={filterOption === 'email' ? filterValue : ''}
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
                highlight={filterOption === 'motherName' ? filterValue : ''}
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
                highlight={filterOption === 'fatherName' ? filterValue : ''}
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
              highlight={filterOption === 'isDeceased' ? filterValue : ''}
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
                highlight={filterOption === 'monitoringType' ? filterValue : ''}
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
                highlight={filterOption === 'phone' ? filterValue : ''}
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
                highlight={filterOption === 'zipCode' ? filterValue : ''}
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
                highlight={filterOption === 'state' ? filterValue : ''}
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
                highlight={filterOption === 'city' ? filterValue : ''}
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
                highlight={filterOption === 'neighborhood' ? filterValue : ''}
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
                highlight={filterOption === 'street' ? filterValue : ''}
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
                highlight={filterOption === 'houseNumber' ? filterValue : ''}
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
                highlight={filterOption === 'complement' ? filterValue : ''}
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
                text={value}
                highlight={filterOption === 'createdBy' ? filterValue : ''}
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
                  highlight={filterOption === 'createdAt' ? filterValue : ''}
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
                  highlight={filterOption === 'updatedAt' ? filterValue : ''}
                />
              )
            )}
          </div>
        ),
      },
      {
        sortingFn: 'datetime',
        accessorKey: 'deletedAt',
        header: ({ column }) => (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            className="px-1! cursor-pointer"
          >
            Deletado em
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
              formatDate(row.getValue('deletedAt') as Date),
              (value) => (
                <HighlightedText
                  text={value}
                  highlight={filterOption === 'deletedAt' ? filterValue : ''}
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
                    router.push(`/patients/${row.getValue('id')}/details`)
                  }
                >
                  <Eye /> Ver detalhes
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="cursor-pointer"
                  onClick={() => router.push(`/patients/${row.getValue('id')}`)}
                >
                  <Pen />
                  Editar paciente
                </DropdownMenuItem>
                <AppAlertDialog
                  title="Você tem certeza absoluta?"
                  description="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
                  cancelAction={{ action: () => {} }}
                  continueAction={{
                    action: handleDelete,
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
  }, [columnFilters, filterOption, handleDelete, router]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const hasRows = table.getRowModel().rows?.length;

  function exportData() {
    const rows = table.getFilteredRowModel().rows.map((row) => row.original);
    exportToCsv(rows, 'data-table-export');
  }

  return (
    <div className="grid grid-cols-1 mx-auto w-full">
      <AppTableToolbar
        table={table}
        filterOption={filterOption}
        setFilterOption={(value: string) => setFilterOption(value as Column)}
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
