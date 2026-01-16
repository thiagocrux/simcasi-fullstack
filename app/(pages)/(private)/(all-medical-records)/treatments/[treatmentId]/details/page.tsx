import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockTreatments } from '@/lib/mock.utils';

export const metadata: Metadata = {
  title: 'Detalhes do tratamento | SIMCASI',
  description:
    'Consulte as informações detalhadas deste tratamento no SIMCASI.',
};

interface TreatmentDetailsPageProps {
  params: Promise<{ treatmentId: string }>;
}

export default async function TreatmentDetailsPage({
  params,
}: TreatmentDetailsPageProps) {
  const { treatmentId } = await params;

  // --- TODO: Replace the logic below with the actual action call
  const treatment = mockTreatments.find(
    (treatment) => treatment.id === treatmentId
  );

  const data = [
    {
      title: 'Dados do tratamento',
      fields: [
        { label: 'Medicamento', value: treatment?.medication },
        { label: 'Unidade de saúde', value: treatment?.healthCenter },
        {
          label: 'Data de início',
          value: Intl.DateTimeFormat('pt-BR').format(treatment?.startDate),
        },
        { label: 'Dosagem', value: treatment?.dosage },
      ],
    },
    {
      title: 'Observações',
      fields: [
        { label: 'Observações', value: treatment?.observations },
        {
          label: 'Informações do parceiro',
          value: treatment?.partnerInformation,
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/patients/${treatment?.patientId}/treatments/${treatment?.id}`);
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
