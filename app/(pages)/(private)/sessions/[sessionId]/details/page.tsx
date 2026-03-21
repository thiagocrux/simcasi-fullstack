import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

import { getSession, revokeSession } from '@/app/actions/session.actions';
import { getUser } from '@/app/actions/user.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { SessionUserPreview } from '@/app/components/features/users/SessionUserPreview';
import { Session } from '@/core/domain/entities/session.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';

export const metadata: Metadata = {
  title: 'Detalhes da sessão | SIMCASI',
  description: 'Consulte as informações detalhadas desta sessão no SIMCASI.',
};

interface SessionDetailsPageProps {
  params: Promise<{ sessionId: string }>;
}

export default async function SessionDetailsPage({
  params,
}: SessionDetailsPageProps) {
  const { sessionId } = await params;

  const response: ActionResponse<Session> = await getSession(sessionId);
  if (!response.success || !response.data) {
    notFound();
  }
  const session = response.data;

  const userResponse = session.userId ? await getUser(session.userId) : null;
  const user =
    userResponse?.success && userResponse.data ? userResponse.data : null;

  const data = [
    {
      title: 'Dados da sessão',
      fields: [
        { label: 'ID', value: session.id },
        { label: 'Usuário (ID)', value: session.userId || '-' },
        { label: 'Endereço IP', value: session.ipAddress || '-' },
        { label: 'User Agent', value: session.userAgent || '-' },
      ],
    },
    {
      title: 'Temporalidade',
      fields: [
        {
          label: 'Emitida em',
          value: session.issuedAt
            ? formatDate(new Date(session.issuedAt))
            : '-',
        },
        {
          label: 'Expira em',
          value: session.expiresAt
            ? formatDate(new Date(session.expiresAt))
            : '-',
        },
        {
          label: 'Criado em',
          value: session.createdAt
            ? formatDate(new Date(session.createdAt))
            : '-',
        },
        {
          label: 'Atualizado em',
          value: session.updatedAt
            ? formatDate(new Date(session.updatedAt))
            : '-',
        },
      ],
    },
  ];

  async function handleNoOp() {
    'use server';
  }

  async function handleRevoke() {
    'use server';
    await revokeSession(sessionId);
    redirect('/sessions');
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Detalhes da sessão"
          description="Aqui você pode visualizar todas as informações desta sessão."
        />
        <DetailsPageActions
          entity="session"
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. A sessão será revogada permanentemente."
          updateAction={{ hidden: true, action: handleNoOp }}
          deleteAction={{ label: 'Revogar sessão', action: handleRevoke }}
        >
          {user && (
            <SessionUserPreview user={user} label="Informações do usuário" />
          )}
        </DetailsPageActions>
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
