import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import {
  deleteObservation,
  getObservation,
} from '@/app/actions/observation.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Observation } from '@/core/domain/entities/observation.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';
import { notFound } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Detalhes da observação | SIMCASI',
  description:
    'Consulte as informações detalhadas desta observação no SIMCASI.',
};

interface ObservationDetailsPageProps {
  params: Promise<{ observationId: string }>;
}

export default async function ObservationDetailsPage({
  params,
}: ObservationDetailsPageProps) {
  const { observationId } = await params;

  const response: ActionResponse<Observation> =
    await getObservation(observationId);
  if (!response.success || !response.data) {
    notFound();
  }
  const observation = response.data;

  const data = [
    {
      title: 'Dados da observação',
      fields: [
        { label: 'Observações', value: observation?.observations ?? '-' },
        {
          label: 'Parceiro sendo tratado',
          value: observation?.hasPartnerBeingTreated ? 'Sim' : 'Não',
        },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        { label: 'ID', value: observation?.id ?? '-' },
        { label: 'Criado por', value: observation?.createdBy ?? '-' },
        {
          label: 'Criado em',
          value: observation?.createdAt
            ? formatDate(new Date(observation.createdAt))
            : '-',
        },
        { label: 'Atualizado por', value: observation?.updatedBy ?? '-' },
        {
          label: 'Atualizado em',
          value: observation?.updatedAt
            ? formatDate(new Date(observation.updatedAt))
            : '-',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(
      `/patients/${observation?.patientId}/observations/${observation?.id}`
    );
  }

  async function handleDelete() {
    'use server';
    deleteObservation(observationId);
  }

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Detalhes da observação"
          description="Aqui você pode visualizar todas as informações desta observação."
        />
        <DetailsPageActions
          entity="observation"
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente a observação."
          updateAction={{ label: 'Editar observação', action: handleUpdate }}
          deleteAction={{ label: 'Deletar observação', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
