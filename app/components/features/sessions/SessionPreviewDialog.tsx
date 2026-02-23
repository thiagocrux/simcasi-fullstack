'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Session } from '@/core/domain/entities/session.entity';
import { formatDate } from '@/lib/formatters.utils';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface SessionPreviewDialogProps {
  title: string;
  description: string;
  session: Session;
  children: ReactNode;
}

export function SessionPreviewDialog({
  title,
  description,
  session,
  children,
}: SessionPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'ID do Usuário',
      value: session?.userId || '-',
    },
    {
      label: 'Data de Emissão',
      value: session?.issuedAt ? formatDate(session.issuedAt) : '-',
    },
    {
      label: 'Data de Expiração',
      value: session?.expiresAt ? formatDate(session.expiresAt) : '-',
    },
    {
      label: 'Endereço IP',
      value: session?.ipAddress || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !session ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !session
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () => router.push(`/sessions/${session.id}/details`),
            }
      }
      content={
        !session ? (
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
