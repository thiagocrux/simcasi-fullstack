'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import {
  getCoreRowModel,
  useReactTable,
  type PaginationState,
} from '@tanstack/react-table';
import {
  ChevronDown,
  Circle,
  CircleCheck,
  IdCard,
  Search,
  User,
  X,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo, useState } from 'react';

import { findPatients } from '@/app/actions/patient.actions';
import { GetPatientOutput } from '@/core/application/contracts/patient/get-patient-by-id.contract';
import { applyMask } from '@/lib/formatters.utils';
import { cn } from '@/lib/shared.utils';
import Image from 'next/image';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '../ui/input-group';
import { Item, ItemContent, ItemMedia } from '../ui/item';
import { ScrollArea } from '../ui/scroll-area';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { AppDialog } from './AppDialog';
import { AppTablePagination } from './AppTablePagination';
import { CustomSkeleton } from './CustomSkeleton';
import { EmptyTableFeedback } from './EmptyTableFeedback';
import { HighlightedText } from './HighlightedText';

type ValidColumns = 'name' | 'cpf' | 'susCardNumber';
type MedicalRecord = 'exams' | 'notifications' | 'observations' | 'treatments';

type Action = {
  action: () => void;
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
};

interface NewMedicalRecordDialogProps {
  variant: MedicalRecord;
  title?: string;
  description?: string;
  cancelAction?: Action;
  children?: ReactNode;
}

export function NewMedicalRecordDialog({
  variant,
  title,
  description,
  cancelAction,
  children,
}: NewMedicalRecordDialogProps) {
  const router = useRouter();

  const [totalWithoutFilter, setTotalWithoutFilter] = useState<number | null>(
    null
  );
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchBy, setSearchBy] = useState<ValidColumns>('name');
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null
  );
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 5,
  });

  const data: Record<MedicalRecord, { label: string; route: string }> = {
    exams: {
      label: 'exame',
      route: `/patients/${selectedPatientId}/exams/new`,
    },
    notifications: {
      label: 'notificação',
      route: `/patients/${selectedPatientId}/notifications/new`,
    },
    observations: {
      label: 'observação',
      route: `/patients/${selectedPatientId}/observations/new`,
    },
    treatments: {
      label: 'tratamento',
      route: `/patients/${selectedPatientId}/treatments/new`,
    },
  };

  const COLUMNS: { label: string; value: ValidColumns }[] = [
    { label: 'Nome', value: 'name' },
    { label: 'CPF', value: 'cpf' },
  ];

  const { data: patientList, isPending } = useQuery({
    queryKey: [
      'find-patients-in-new-medical-record-dialog',
      pagination,
      searchValue,
      searchBy,
    ],
    queryFn: async () =>
      await findPatients({
        skip: pagination.pageIndex * pagination.pageSize,
        take: pagination.pageSize,
        search: searchValue,
        searchBy,
        includeDeleted: false,
      }),
    placeholderData: keepPreviousData,
  });

  const patients = useMemo(() => {
    return patientList?.success ? patientList.data.items : [];
  }, [patientList]);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data: patients,
    columns: [],
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: patientList?.success
      ? Math.ceil(patientList.data.total / pagination.pageSize)
      : -1,
    state: {
      pagination,
    },
  });

  useEffect(() => {
    if (patientList?.success && !searchValue) {
      setTotalWithoutFilter(patientList.data.total);
    }
  }, [patientList, searchValue]);

  useEffect(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, [searchValue]);

  const hasPatientsInDatabase =
    totalWithoutFilter !== null && totalWithoutFilter > 0;

  return (
    <AppDialog
      title={title ?? 'Quase lá! Vamos selecionar um paciente.'}
      description={
        description ??
        `Toda criação de ${data[variant].label} exige que haja um paciente vinculado para que consultas.`
      }
      cancelAction={{
        label: cancelAction?.label,
        disabled: false,
        hidden: !hasPatientsInDatabase,
        action: cancelAction?.action ?? (() => {}),
      }}
      continueAction={{
        label: `Cadastrar ${data[variant].label}`,
        disabled: !selectedPatientId,
        hidden: !hasPatientsInDatabase,
        action: () => {
          router.push(data[variant].route);
        },
      }}
      className="px-2 xs:px-6 py-8"
      content={
        <div className="flex flex-col gap-2">
          {isPending && <CustomSkeleton variant="item-list" />}
          {hasPatientsInDatabase && (
            <InputGroup className="max-w-full md:max-w-[500px]">
              <InputGroupInput
                type="text"
                placeholder="Pesquisar por..."
                value={searchValue}
                onChange={(event) => setSearchValue(event?.target.value)}
                className="w-full"
              />
              <InputGroupAddon align="inline-start" className="cursor-pointer">
                <Search />
              </InputGroupAddon>

              {searchValue ? (
                <Button
                  type="button"
                  size="icon-sm"
                  variant="ghost"
                  className="mr-1 size-6 cursor-pointer"
                  onClick={() => setSearchValue('')}
                >
                  <X />
                </Button>
              ) : null}

              <InputGroupAddon align="inline-end" className="cursor-pointer">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      className="-mr-1.25 ml-auto border-t-0 border-r-0 border-b-0 border-l rounded-tl-none rounded-bl-none h-8.5 cursor-pointer"
                      size="sm"
                    >
                      {
                        COLUMNS.find((column) => column.value === searchBy)
                          ?.label
                      }
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {COLUMNS.map((column) => (
                      <DropdownMenuItem
                        key={column.value}
                        className="cursor-pointer"
                        onClick={() => setSearchBy(column.value)}
                      >
                        {column.label}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </InputGroupAddon>
            </InputGroup>
          )}

          {hasPatientsInDatabase && (
            <>
              {patients.length === 0 && (
                <div className="flex flex-col justify-center items-center gap-4 min-h-72">
                  <Image
                    src="/icons/nothing-here.svg"
                    width="180"
                    height="180"
                    alt=""
                  />
                  <p className="w-xs font-medium text-center">
                    Sua busca não retornou resultados. Ajuste os filtros e tente
                    de novo!
                  </p>
                </div>
              )}

              {patients.length > 0 && (
                <>
                  <ScrollArea
                    className={cn(
                      'relative rounded-md h-72',
                      patients.length > 3 && 'pr-3'
                    )}
                  >
                    <>
                      <div className="-bottom-1 absolute backdrop-blur-[1px] w-full h-4" />
                      <div className="flex flex-col gap-2">
                        {patients.map((patient: GetPatientOutput) => (
                          <button
                            type="button"
                            key={patient.id}
                            className="rounded-md focus:-outline-offset-2 w-full"
                            onClick={() => {
                              setSelectedPatientId((prevState) =>
                                prevState === patient.id ? null : patient.id
                              );
                            }}
                          >
                            <Item
                              variant="outline"
                              className={cn(
                                'bg-card hover:bg-accent/90 border border-border w-full cursor-pointer',
                                patient.id === selectedPatientId &&
                                  'border-green-500'
                              )}
                            >
                              <ItemMedia variant="default">
                                {patient.id === selectedPatientId ? (
                                  <CircleCheck className="size-4 text-green-500" />
                                ) : (
                                  <Circle className="text-border size-4" />
                                )}
                              </ItemMedia>
                              <ItemContent className="flex justify-start items-start">
                                <p className="flex items-center gap-2 text-sm">
                                  <User className="size-4" />
                                  <HighlightedText
                                    text={patient.name}
                                    highlight={
                                      searchBy === 'name' ? searchValue : ''
                                    }
                                  />
                                </p>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <p className="flex items-center gap-2 text-muted-foreground text-sm">
                                      <IdCard className="size-4" />
                                      <HighlightedText
                                        text={applyMask(patient.cpf, 'cpf')}
                                        highlight={
                                          searchBy === 'cpf' ? searchValue : ''
                                        }
                                      />
                                    </p>
                                  </TooltipTrigger>
                                  <TooltipContent side="bottom">
                                    <p>CPF</p>
                                  </TooltipContent>
                                </Tooltip>
                              </ItemContent>
                            </Item>
                          </button>
                        ))}
                      </div>
                    </>
                  </ScrollArea>
                  <AppTablePagination
                    table={table}
                    showPaginationInput={false}
                  />
                </>
              )}
            </>
          )}

          {totalWithoutFilter === 0 ? (
            <EmptyTableFeedback variant="patients" />
          ) : null}
        </div>
      }
    >
      {children}
    </AppDialog>
  );
}
