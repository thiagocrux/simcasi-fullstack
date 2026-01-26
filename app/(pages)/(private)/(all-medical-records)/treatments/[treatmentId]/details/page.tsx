import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { deleteTreatment, getTreatment } from '@/app/actions/treatment.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Treatment } from '@/core/domain/entities/treatment.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { notFound } from 'next/navigation';

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

  const response: ActionResponse<Treatment> = await getTreatment(treatmentId);

  if (!response.success || !response.data) {
    notFound();
  }

  const treatment = response.data;

  const data = [
    {
      title: 'Dados do tratamento',
      fields: [
        { label: 'Medicamento', value: treatment?.medication },
        { label: 'Unidade de saúde', value: treatment?.healthCenter },
        {
          label: 'Data de início',
          value: treatment?.startDate
            ? Intl.DateTimeFormat('pt-BR').format(new Date(treatment.startDate))
            : '-',
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
    deleteTreatment(treatmentId);
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
