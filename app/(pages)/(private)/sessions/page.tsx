import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { SessionsTable } from '@/app/components/features/sessions/SessionsTable';

export const metadata: Metadata = {
  title: 'Lista de sessões | SIMCASI',
  description:
    'Visualize todos as sessões criadas e exclua registros de sessões no SIMCASI.',
};

export default function SessionsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de sessões"
        description="Visualize todas as sessões ativas e revogue acessos quando necessário."
      />
      <SessionsTable showIdColumn={false} />
    </div>
  );
}
