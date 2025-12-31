import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockUsers } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Detalhes do usuário | SIMCASI',
  description: 'Consulte as informações detalhadas deste usuário no SIMCASI.',
};

interface UserDetailsPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UserDetailsPage({
  params,
}: UserDetailsPageProps) {
  const { userId } = await params;

  // --- TODO: Replace the logic below with the actual action call
  const user = mockUsers.find((user) => user.id === userId);

  const data = [
    {
      title: 'Identificação e acesso',
      fields: [
        { label: 'ID', value: user?.roleId },
        { label: 'Nome', value: user?.name },
        { label: 'E-mail', value: user?.email },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/users/${user?.id}`);
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
          title="Detalhes do usuário"
          description="Aqui você pode visualizar todas as informações completas deste usuário."
        />
        <DetailsPageActions
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o usuário."
          updateAction={{ label: 'Editar usuário', action: handleUpdate }}
          deleteAction={{ label: 'Deletar usuário', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
