import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { TreatmentsTable } from '@/app/components/features/treatments/TreatmentsTable';

export const metadata: Metadata = {
  title: 'Lista de tratamentos | SIMCASI',
  description:
    'Visualize todos os tratamentos cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os tratamentos do SIMCASI.',
};

export default function TreatmentsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de tratamentos"
        description="Visualize todos os tratamentos cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os tratamentos do SIMCASI."
      />
      <TreatmentsTable />
    </div>
  );
}
