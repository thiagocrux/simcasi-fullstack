import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockTreatments } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Detalhes do tratamento | SIMCASI',
  description:
    'Consulte as informações detalhadas deste tratamento no SIMCASI.',
};

export default function TreatmentDetailsPage() {
  const data = [
    {
      title: 'Dados do tratamento',
      fields: [
        { label: 'Medicamento', value: mockTreatments[0].medication },
        { label: 'Unidade de saúde', value: mockTreatments[0].healthCenter },
        {
          label: 'Data de início',
          value: new Date(mockTreatments[0].startDate).toLocaleDateString(
            'pt-BR'
          ),
        },
        { label: 'Dosagem', value: mockTreatments[0].dosage },
      ],
    },
    {
      title: 'Observações',
      fields: [
        { label: 'Observações', value: mockTreatments[0].observations },
        {
          label: 'Informações do parceiro',
          value: mockTreatments[0].partnerInformation,
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/treatments/${mockTreatments[0].id}`);
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
          title="Detalhes do tratamento"
          description="Aqui você pode visualizar todas as informações deste tratamento."
        />
        <DetailsPageActions
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o tratamento."
          updateAction={{ label: 'Editar tratamento', action: handleUpdate }}
          deleteAction={{ label: 'Deletar tratamento', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
