'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Notification } from '@/core/domain/entities/notification.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface NotificationPreviewDialogProps {
  title: string;
  description: string;
  notification: Notification;
  children: ReactNode;
}

export function NotificationPreviewDialog({
  title,
  description,
  notification,
  children,
}: NotificationPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'ID do Paciente',
      value: notification?.patientId || '-',
    },
    {
      label: 'Número do SINAN',
      value: notification?.sinan || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !notification ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !notification
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () =>
                router.push(`/notifications/${notification.id}/details`),
            }
      }
      content={
        !notification ? (
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
