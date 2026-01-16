import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { NotificationsTable } from '@/app/components/features/notifications/NotificationsTable';
import { mockNotifications } from '@/lib/mock.utils';
import { Notification } from '@/prisma/generated/client';

export const metadata: Metadata = {
  title: 'Lista de notificações | SIMCASI',
  description:
    'Visualize todas as notificações cadastradas, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todas as notificações do SIMCASI.',
};

// TODO: Replace this mock data with the actual list of notifications.
export const data: Notification[] = mockNotifications;

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de notificações"
        description="Visualize todas as notificações cadastradas, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todas as notificações do SIMCASI."
      />
      <NotificationsTable data={data} />
    </div>
  );
}
