'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Observation } from '@/core/domain/entities/observation.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface ObservationPreviewDialogProps {
  title: string;
  description: string;
  observation: Observation;
  children: ReactNode;
}

export function ObservationPreviewDialog({
  title,
  description,
  observation,
  children,
}: ObservationPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'ID do Paciente',
      value: observation?.patientId || '-',
    },
    {
      label: 'Parceiro em tratamento?',
      value: observation?.hasPartnerBeingTreated ? 'Sim' : 'Não',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !observation ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !observation
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () =>
                router.push(`/observations/${observation.id}/details`),
            }
      }
      content={
        !observation ? (
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
