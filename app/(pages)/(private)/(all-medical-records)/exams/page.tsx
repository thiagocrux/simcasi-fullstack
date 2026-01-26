import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { ExamsTable } from '@/app/components/features/exams/ExamsTable';

export const metadata: Metadata = {
  title: 'Lista de exames | SIMCASI',
  description:
    'Visualize todos os exames cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os exames do SIMCASI.',
};

export default function ExamsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de exames"
        description="Visualize todos os exames cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os exames do SIMCASI."
      />
      <ExamsTable />
    </div>
  );
}
