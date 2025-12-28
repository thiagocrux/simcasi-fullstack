import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockPatients } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Detalhes do paciente | SIMCASI',
  description:
    'Consulte todas as informações detalhadas deste paciente no SIMCASI.',
};

export default function PatientDetailsPage() {
  const data = [
    {
      title: 'Identificação e dados pessoais',
      fields: [
        {
          label: 'Número do cartão do SUS',
          value: mockPatients[0].susCardNumber,
        },
        { label: 'Nome', value: mockPatients[0].name },
        { label: 'CPF', value: mockPatients[0].cpf },
        { label: 'Nome social', value: mockPatients[0].socialName },
        {
          label: 'Data de nascimento',
          value: new Date(mockPatients[0].birthDate).toLocaleDateString(
            'pt-BR'
          ),
        },
        { label: 'Nome da mãe', value: mockPatients[0].motherName },
        { label: 'Nome do pai', value: mockPatients[0].fatherName },
      ],
    },
    {
      title: 'Situação clínica',
      fields: [
        {
          label: 'Tipo de monitoramento',
          value: mockPatients[0].monitoringType,
        },
        {
          label: 'Falecido',
          value: mockPatients[0].isDeceased ? 'Sim' : 'Não',
        },
      ],
    },
    {
      title: 'Dados demográficos e sociais',
      fields: [
        { label: 'Raça', value: mockPatients[0].race },
        { label: 'Sexo', value: mockPatients[0].sex },
        { label: 'Gênero', value: mockPatients[0].gender },
        { label: 'Sexualidade', value: mockPatients[0].sexuality },
        { label: 'Nacionalidade', value: mockPatients[0].nationality },
        { label: 'Escolaridade', value: mockPatients[0].schooling },
      ],
    },
    {
      title: 'Contato e endereço',
      fields: [
        { label: 'Telefone', value: mockPatients[0].phone },
        { label: 'E-mail', value: mockPatients[0].email },
        { label: 'CEP', value: mockPatients[0].zipCode },
        { label: 'Estado', value: mockPatients[0].state },
        { label: 'Cidade', value: mockPatients[0].city },
        { label: 'Bairro', value: mockPatients[0].neighborhood },
        { label: 'Rua', value: mockPatients[0].street },
        { label: 'Número da casa', value: mockPatients[0].houseNumber },
        { label: 'Complemento', value: mockPatients[0].complement },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/patients/${mockPatients[0].id}`);
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
