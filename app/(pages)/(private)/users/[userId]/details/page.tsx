import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { deleteUser, getUser } from '@/app/actions/user.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { GetUserOutput } from '@/core/application/contracts/user/get-user-by-id.contract';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';
import { notFound } from 'next/navigation';

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

  const response: ActionResponse<GetUserOutput> = await getUser(userId);
  if (!response.success || !response.data) {
    notFound();
  }

  const user = response.data;

  const data = [
    {
      title: 'Identificação e acesso',
      fields: [
        { label: 'ID do cargo', value: user?.roleId ?? '-' },
        { label: 'Nome', value: user?.name ?? '-' },
        { label: 'E-mail', value: user?.email ?? '-' },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        {
          label: 'ID',
          value: user?.id ?? '-',
        },
        {
          label: 'Criado por',
          value: user?.createdBy ?? '-',
        },
        {
          label: 'Criado em',
          value: user?.createdAt ? formatDate(new Date(user.createdAt)) : '-',
        },
        {
          label: 'Atualizado por',
          value: user?.updatedBy ?? '-',
        },
        {
          label: 'Atualizado em',
          value: user?.updatedAt ? formatDate(new Date(user.updatedAt)) : '-',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/users/${user?.id}`);
  }

  async function handleDelete() {
    'use server';
    deleteUser(userId);
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
