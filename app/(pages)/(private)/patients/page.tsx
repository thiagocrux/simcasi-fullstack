import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { PatientsTable } from '@/app/components/features/patients/PatientsTable';

export const metadata: Metadata = {
  title: 'Lista de pacientes | SIMCASI',
  description:
    'Visualize todos os pacientes cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os pacientes do SIMCASI.',
};

export default function PatientsPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de pacientes"
        description="Visualize todos os pacientes cadastrados, exclua, edite ou crie novos registros. Gerencie facilmente as informações de todos os pacientes do SIMCASI."
      />
      <PatientsTable showIdColumn={false} />
    </div>
  );
}
