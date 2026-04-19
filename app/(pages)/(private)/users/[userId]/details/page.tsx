import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { revokeAllSessionsByUserId } from '@/app/actions/session.actions';
import { deleteUser, getUser } from '@/app/actions/user.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { RevokeAllSessionsButton } from '@/app/components/features/sessions/RevokeAllSessionsButton';
import { GetUserByIdOutput } from '@/core/application/contracts/user/get-user-by-id.contract';
import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { isImmutableEmail } from '@/core/domain/utils/user.utils';
import { publicEnv } from '@/core/infrastructure/lib/env.public';
import { ActionResponse } from '@/lib/actions.utils';
import { applyMask, formatDate } from '@/lib/formatters.utils';
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

  const response: ActionResponse<GetUserByIdOutput> = await getUser(userId);
  if (!response.success || !response.data) {
    notFound();
  }

  const user = response.data;

  const data = [
    {
      title: 'Identificação pessoal',
      fields: [
        { label: 'Nome', value: user?.name || '-' },
        {
          label: 'CPF',
          value: user?.cpf ? applyMask(user.cpf, 'cpf') : '-',
        },
      ],
    },
    {
      title: 'Contato',
      fields: [
        { label: 'E-mail', value: user?.email || '-' },
        {
          label: 'Telefone',
          value: user?.phone ? applyMask(user.phone, 'phone') : '-',
        },
      ],
    },
    {
      title: 'Vínculo profissional',
      fields: [
        { label: 'Cargo', value: user?.roleId || '-' },
        {
          label: 'Matrícula',
          value: user?.enrollmentNumber || '-',
        },
        {
          label: 'Registro profissional',
          value: user?.professionalRegistration || '-',
        },
        {
          label: 'Local de trabalho',
          value: user?.workplace || '-',
        },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        {
          label: 'ID',
          value: user?.id || '-',
        },
        {
          label: 'Criado por',
          value: user?.createdBy || '-',
        },
        {
          label: 'Criado em',
          value: user?.createdAt ? formatDate(new Date(user.createdAt)) : '-',
        },
        {
          label: 'Atualizado por',
          value: user?.updatedBy || '-',
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

  async function handleRevokeAllSessions() {
    'use server';
    await revokeAllSessionsByUserId(userId);
    redirect(`/users/${userId}/details`);
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Detalhes do usuário"
          description="Aqui você pode visualizar todas as informações deste usuário."
        />
        <DetailsPageActions
          entity="user"
          entityId={userId}
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o usuário."
          updateAction={{ label: 'Editar usuário', action: handleUpdate }}
          deleteAction={{
            label: 'Deletar usuário',
            action: handleDelete,
            hidden:
              isImmutableEmail(
                user.email,
                publicEnv.NEXT_PUBLIC_DEFAULT_USER_EMAIL
              ) || userId === SYSTEM_CONSTANTS.DEFAULT_SYSTEM_USER_ID,
          }}
        >
          <RevokeAllSessionsButton
            targetUserId={userId}
            action={handleRevokeAllSessions}
          />
        </DetailsPageActions>
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
