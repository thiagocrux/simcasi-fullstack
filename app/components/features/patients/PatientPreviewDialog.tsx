'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Patient } from '@/core/domain/entities/patient.entity';
import { AppDialog } from '../../common/AppDialog';
import { ClipboardCopyButton } from '../../common/ClipboardCopyButton';

interface PatientPreviewDialogProps {
  title: string;
  description: string;
  patient: Patient;
  children: ReactNode;
}

export function PatientPreviewDialog({
  title,
  description,
  patient,
  children,
}: PatientPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'Nome',
      value: patient?.name || '-',
    },
    {
      label: 'CPF',
      value: patient?.cpf || '-',
    },
    {
      label: 'Número do cartão do SUS',
      value: patient?.susCardNumber || '-',
    },
  ];

  if (!patient) {
    return '-';
  }

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: 'Cancelar',
        action: () => {},
      }}
      continueAction={{
        label: 'Acessar o perfil completo',
        action: () => router.push(`/patients/${patient.id}/details`),
      }}
      content={
        <div className="flex flex-col gap-0.5 overflow-hidden text-sm">
          {fields.map((field) => (
            <div
              key={`${field.label}-${field.value}`}
              className="flex sm:flex-row flex-col items-start sm:items-center"
            >
              <p className="text-muted-foreground">{field.label}</p>
              <div className="flex-1 mx-2 border-b border-dashed" />
              {field.value && (
                <ClipboardCopyButton text={field.value} variant="label" />
              )}
            </div>
          ))}
        </div>
      }
    >
      {children}
    </AppDialog>
  );
}
