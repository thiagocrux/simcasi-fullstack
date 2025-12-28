import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockNotifications } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Detalhes da notificação | SIMCASI',
  description:
    'Consulte as informações detalhadas desta notificação no SIMCASI.',
};

export default function NotificationDetailsPage() {
  const data = [
    {
      title: 'Dados da notificação',
      fields: [
        { label: 'SINAN', value: mockNotifications[0].sinan },
        { label: 'Observações', value: mockNotifications[0].observations },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/notifications/${mockNotifications[0].id}`);
  }

  async function handleDelete() {
    'use server';
    console.log('handleDelete called!');
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
