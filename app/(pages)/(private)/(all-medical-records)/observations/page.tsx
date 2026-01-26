import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { ObservationsTable } from '@/app/components/features/observations/ObservationsTable';

export const metadata: Metadata = {
  title: 'Lista de observações | SIMCASI',
  description:
    'Visualize todas as observações cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os observações do SIMCASI.',
};

export default function ObservationsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de observações"
        description="Visualize todas as observações cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todas as observações do SIMCASI."
      />
      <ObservationsTable />
    </div>
  );
}
