import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockPatients } from '@/lib/mock.utils';

export const metadata: Metadata = {
  title: 'Detalhes do paciente | SIMCASI',
  description:
    'Consulte todas as informações detalhadas deste paciente no SIMCASI.',
};

interface PatientDetailsPageProps {
  params: Promise<{ patientId: string }>;
}

export default async function PatientDetailsPage({
  params,
}: PatientDetailsPageProps) {
  const { patientId } = await params;

  // --- TODO: Replace the logic below with the actual action call
  const patient = mockPatients.find((patient) => patient.id === patientId);

  const data = [
    {
      title: 'Identificação e dados pessoais',
      fields: [
        {
          label: 'Número do cartão do SUS',
          value: patient?.susCardNumber,
        },
        { label: 'Nome', value: patient?.name },
        { label: 'CPF', value: patient?.cpf },
        { label: 'Nome social', value: patient?.socialName },
        {
          label: 'Data de nascimento',
          value: Intl.DateTimeFormat('pt-BR').format(patient?.birthDate),
        },
        { label: 'Nome da mãe', value: patient?.motherName },
        { label: 'Nome do pai', value: patient?.fatherName },
      ],
    },
    {
      title: 'Situação clínica',
      fields: [
        {
          label: 'Tipo de monitoramento',
          value: patient?.monitoringType,
        },
        {
          label: 'Falecido',
          value: patient?.isDeceased ? 'Sim' : 'Não',
        },
      ],
    },
    {
      title: 'Dados demográficos e sociais',
      fields: [
        { label: 'Raça', value: patient?.race },
        { label: 'Sexo', value: patient?.sex },
        { label: 'Gênero', value: patient?.gender },
        { label: 'Sexualidade', value: patient?.sexuality },
        { label: 'Nacionalidade', value: patient?.nationality },
        { label: 'Escolaridade', value: patient?.schooling },
      ],
    },
    {
      title: 'Contato e endereço',
      fields: [
        { label: 'Telefone', value: patient?.phone },
        { label: 'E-mail', value: patient?.email },
        { label: 'CEP', value: patient?.zipCode },
        { label: 'Estado', value: patient?.state },
        { label: 'Cidade', value: patient?.city },
        { label: 'Bairro', value: patient?.neighborhood },
        { label: 'Rua', value: patient?.street },
        { label: 'Número da casa', value: patient?.houseNumber },
        { label: 'Complemento', value: patient?.complement },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/patients/${patient?.id}`);
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
          title="Detalhes do paciente"
          description="Aqui você pode visualizar todas as informações completas deste
            paciente, incluindo dados pessoais, clínicos e de contato."
        />
        <DetailsPageActions
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente os dados do paciente dos nossos servidores."
          updateAction={{ label: 'Editar paciente', action: handleUpdate }}
          deleteAction={{ label: 'Deletar paciente', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
