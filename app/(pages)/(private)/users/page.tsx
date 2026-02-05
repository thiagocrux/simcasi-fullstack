import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { UsersTable } from '@/app/components/features/users/UsersTable';

export const metadata: Metadata = {
  title: 'Lista de usuários | SIMCASI',
  description:
    'Visualize todos os usuários cadastrados, exclua registros, acesse a página de edição e crie usuários. Gerencie facilmente o acesso e os dados da sua equipe no SIMCASI.',
};

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de usuários"
        description="Visualize todos os usuários cadastrados, exclua registros, acesse a página de edição e crie usuários. Gerencie facilmente o acesso e os dados da sua equipe no SIMCASI."
      />
      <UsersTable showIdColumn={false} />
    </div>
  );
}
