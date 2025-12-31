import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockObservations } from '@/lib/mock';

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

  // --- TODO: Replace the logic below with the actual action call
  const observation = mockObservations.find(
    (observation) => observation.id === observationId
  );

  const data = [
    {
      title: 'Dados da observação',
      fields: [
        { label: 'Observações', value: observation?.observations },
        {
          label: 'Parceiro sendo tratado',
          value: observation?.hasPartnerBeingTreated ? 'Sim' : 'Não',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/observations/${observation?.id}`);
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
          title="Detalhes da observação"
          description="Aqui você pode visualizar todas as informações desta observação."
        />
        <DetailsPageActions
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
