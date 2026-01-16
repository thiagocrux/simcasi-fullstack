import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { UsersTable } from '@/app/components/features/users/UsersTable';
import { mockUsers } from '@/lib/mock.utils';
import { User } from '@prisma/client';

export const metadata: Metadata = {
  title: 'Lista de usuários | SIMCASI',
  description:
    'Visualize todos os usuários cadastrados, exclua registros, acesse a página de edição e crie usuários. Gerencie facilmente o acesso e os dados da sua equipe no SIMCASI.',
};

// TODO: Replace this mock data with the actual list of users.
export const data: User[] = mockUsers;

export default function UsersPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Lista de usuários"
        description="Visualize todos os usuários cadastrados, exclua registros, acesse a página de edição e crie usuários. Gerencie facilmente o acesso e os dados da sua equipe no SIMCASI."
      />
      <UsersTable data={data} />
    </div>
  );
}
