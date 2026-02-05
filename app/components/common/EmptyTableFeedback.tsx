'use client';

import { usePermission } from '@/hooks/usePermission';
import { LayoutDashboard, Plus } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { NewMedicalRecordDialog } from './NewMedicalRecordDialog';

const MEDICAL_RECORD_VARIANTS = [
  'exams',
  'notifications',
  'observations',
  'treatments',
];

type MedicalRecordVariant =
  | 'exams'
  | 'notifications'
  | 'observations'
  | 'treatments';

type Variant = 'users' | 'patients' | MedicalRecordVariant;

interface EmptyTableProps {
  variant: Variant;
  patientId?: string;
}

export function EmptyTableFeedback({ variant, patientId }: EmptyTableProps) {
  const router = useRouter();
  const { can } = usePermission();

  const variantMapper: Record<
    Variant,
    {
      title: string;
      description: string;
      buttonLabel: string;
      permission: string;
      action?: () => void;
    }
  > = {
    users: {
      title: 'Ops! Nenhum usuário foi encontrado.',
      description:
        'Comece agora mesmo cadastrando o primeiro usuário do sistema.',
      buttonLabel: 'Cadastrar usuário',
      permission: 'create:user',
    },
    patients: {
      title: 'Ops! Nenhum paciente foi encontrado.',
      description:
        'Comece agora mesmo cadastrando o primeiro paciente do sistema.',
      buttonLabel: 'Cadastrar paciente',
      permission: 'create:patient',
    },
    exams: {
      title: !!patientId
        ? 'Nenhum exame encontrado para este paciente.'
        : 'Ops! Nenhum exame foi encontrado.',
      description: !!patientId
        ? 'Este paciente ainda não possui exames cadastrados.'
        : 'Comece agora mesmo cadastrando o primeiro exame do sistema.',
      buttonLabel: 'Cadastrar exame',
      permission: 'create:exam',
    },
    notifications: {
      title: !!patientId
        ? 'Nenhuma notificação encontrada para este paciente.'
        : 'Ops! Nenhuma notificação foi encontrada.',
      description: !!patientId
        ? 'Este paciente ainda não possui notificações cadastradas.'
        : 'Comece agora mesmo cadastrando a primeira notificação do sistema.',
      buttonLabel: 'Cadastrar notificação',
      permission: 'create:notification',
    },
    observations: {
      title: !!patientId
        ? 'Nenhuma observação encontrada para este paciente.'
        : 'Ops! Nenhuma observação foi encontrada.',
      description: !!patientId
        ? 'Este paciente ainda não possui observações cadastradas.'
        : 'Comece agora mesmo cadastrando a primeira observação do sistema.',
      buttonLabel: 'Cadastrar observação',
      permission: 'create:observation',
    },
    treatments: {
      title: !!patientId
        ? 'Nenhum tratamento encontrado para este paciente.'
        : 'Ops! Nenhum tratamento foi encontrado.',
      description: !!patientId
        ? 'Este paciente ainda não possui tratamentos cadastrados.'
        : 'Comece agora mesmo cadastrando o primeiro tratamento do sistema.',
      buttonLabel: 'Cadastrar tratamento',
      permission: 'create:treatment',
    },
  };

  return (
    <div className="flex flex-col justify-center items-center gap-6 mx-auto sm:p-12 px-6 rounded-md max-w-lg text-center">
      <Image
        src="/icons/no-results-found.svg"
        width={150}
        height={150}
        alt=""
      />
      {can(variantMapper[variant].permission) ? (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">{variantMapper[variant].title}</p>
          <p className="text-muted-foreground">
            {variantMapper[variant].description}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <p className="font-bold text-xl">Nenhum registro cadastrado</p>
          <p className="text-muted-foreground">
            Nenhum dado está disponível para visualização no momento. Caso
            precise de acesso, procure o administrador do sistema..
          </p>
        </div>
      )}

      {can(variantMapper[variant].permission) ? (
        MEDICAL_RECORD_VARIANTS.includes(variant) ? (
          patientId ? (
            <Button
              size="lg"
              className="flex items-center gap-2 cursor-pointer select-none"
              onClick={() =>
                router.push(`/patients/${patientId}/${variant}/new`)
              }
            >
              <Plus />
              {variantMapper[variant].buttonLabel}
            </Button>
          ) : (
            <NewMedicalRecordDialog variant={variant as MedicalRecordVariant}>
              <Button
                size="lg"
                className="flex items-center gap-2 cursor-pointer select-none"
              >
                <Plus />
                {variantMapper[variant].buttonLabel}
              </Button>
            </NewMedicalRecordDialog>
          )
        ) : (
          <Button
            size="lg"
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={() => router.push(`${variant}/new`)}
          >
            <Plus className="w-4 h-4" />
            {variantMapper[variant].buttonLabel}
          </Button>
        )
      ) : null}

      {!can(variantMapper[variant].permission) && (
        <Button
          size="lg"
          className="flex items-center gap-2 cursor-pointer select-none"
          onClick={() => router.push('/dashboard')}
        >
          <LayoutDashboard className="w-4 h-4" />
          Ir para a dashboard
        </Button>
      )}
    </div>
  );
}
