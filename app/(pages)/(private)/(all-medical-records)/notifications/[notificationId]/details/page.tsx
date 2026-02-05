import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
  deleteNotification,
  getNotification,
} from '@/app/actions/notification.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Notification } from '@/core/domain/entities/notification.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Detalhes da notificação | SIMCASI',
  description:
    'Consulte as informações detalhadas desta notificação no SIMCASI.',
};

interface NotificationDetailsPageProps {
  params: Promise<{ notificationId: string }>;
}

export default async function NotificationDetailsPage({
  params,
}: NotificationDetailsPageProps) {
  const { notificationId } = await params;

  const response: ActionResponse<Notification> =
    await getNotification(notificationId);
  if (!response.success || !response.data) {
    notFound();
  }
  const notification = response.data;

  const data = [
    {
      title: 'Dados da notificação',
      fields: [
        { label: 'SINAN', value: notification?.sinan || '-' },
        { label: 'Observações', value: notification?.observations || '-' },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        {
          label: 'ID',
          value: notification?.id || '-',
        },
        {
          label: 'Criado por',
          value: notification?.createdBy || '-',
        },
        {
          label: 'Criado em',
          value: notification?.createdAt
            ? formatDate(new Date(notification.createdAt))
            : '-',
        },
        {
          label: 'Atualizado por',
          value: notification?.updatedBy || '-',
        },
        {
          label: 'Atualizado em',
          value: notification?.updatedAt
            ? formatDate(new Date(notification.updatedAt))
            : '-',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(
      `/patients/${notification?.patientId}/notifications/${notification?.id}`
    );
  }

  async function handleDelete() {
    'use server';
    deleteNotification(notificationId);
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Detalhes da notificação"
          description="Aqui você pode visualizar todas as informações desta notificação."
        />
        <DetailsPageActions
          entity="notification"
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a notificação."
          updateAction={{ label: 'Editar notificação', action: handleUpdate }}
          deleteAction={{ label: 'Deletar notificação', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
