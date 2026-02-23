'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Treatment } from '@/core/domain/entities/treatment.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface TreatmentPreviewDialogProps {
  title: string;
  description: string;
  treatment: Treatment;
  children: ReactNode;
}

export function TreatmentPreviewDialog({
  title,
  description,
  treatment,
  children,
}: TreatmentPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'ID do Paciente',
      value: treatment?.patientId || '-',
    },
    {
      label: 'Medicamento',
      value: treatment?.medication || '-',
    },
    {
      label: 'Unidade de Saúde',
      value: treatment?.healthCenter || '-',
    },
    {
      label: 'Dosagem',
      value: treatment?.dosage || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !treatment ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !treatment
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () => router.push(`/treatments/${treatment.id}/details`),
            }
      }
      content={
        !treatment ? (
          <NotFoundPreviewContent />
        ) : (
          <PreviewDialogContent fields={fields} />
        )
      }
    >
      {children}
    </AppDialog>
  );
}
