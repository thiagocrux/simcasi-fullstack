import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { NotificationsTable } from '@/app/components/features/notifications/NotificationsTable';

export const metadata: Metadata = {
  title: 'Lista de notificações | SIMCASI',
  description:
    'Visualize todas as notificações cadastradas, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todas as notificações do SIMCASI.',
};

export default function NotificationsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de notificações"
        description="Visualize todas as notificações cadastradas, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todas as notificações do SIMCASI."
      />
      <NotificationsTable />
    </div>
  );
}
