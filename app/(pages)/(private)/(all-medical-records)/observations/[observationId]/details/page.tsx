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

export default function ObservationDetailsPage() {
  const data = [
    {
      title: 'Dados da observação',
      fields: [
        { label: 'Observações', value: mockObservations[0].observations },
        {
          label: 'Parceiro sendo tratado',
          value: mockObservations[0].hasPartnerBeingTreated ? 'Sim' : 'Não',
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/observations/${mockObservations[0].id}`);
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
