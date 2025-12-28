import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockExams } from '@/lib/mock';

export const metadata: Metadata = {
  title: 'Detalhes do exame | SIMCASI',
  description: 'Consulte as informações detalhadas deste exame no SIMCASI.',
};

export default function ExamDetailsPage() {
  const data = [
    {
      title: 'Teste Treponêmico',
      fields: [
        { label: 'Tipo', value: mockExams[0].treponemalTestType },
        { label: 'Resultado', value: mockExams[0].treponemalTestResult },
        {
          label: 'Data',
          value: new Date(mockExams[0].treponemalTestDate).toLocaleDateString(
            'pt-BR'
          ),
        },
        { label: 'Local', value: mockExams[0].treponemalTestLocation },
      ],
    },
    {
      title: 'Teste Não Treponêmico',
      fields: [
        { label: 'VDRL', value: mockExams[0].nontreponemalVdrlTest },
        { label: 'Titulação', value: mockExams[0].nontreponemalTestTitration },
        {
          label: 'Data',
          value: new Date(
            mockExams[0].nontreponemalTestDate
          ).toLocaleDateString('pt-BR'),
        },
      ],
    },
    {
      title: 'Outros',
      fields: [
        {
          label: 'Outro teste não treponêmico',
          value: mockExams[0].otherNontreponemalTest,
        },
        {
          label: 'Data do outro teste não treponêmico',
          value: mockExams[0].otherNontreponemalTestDate
            ? new Date(
                mockExams[0].otherNontreponemalTestDate
              ).toLocaleDateString('pt-BR')
            : null,
        },
        {
          label: 'Observações de referência',
          value: mockExams[0].referenceObservations,
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/exams/${mockExams[0].id}`);
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
          title="Detalhes do exame"
          description="Aqui você pode visualizar todas as informações deste exame."
        />
        <DetailsPageActions
          dialogTitle="Você tem certeza absoluta?"
          dialogDescription="Esta ação não pode ser desfeita. Isso irá deletar permanentemente o exame."
          updateAction={{ label: 'Editar exame', action: handleUpdate }}
          deleteAction={{ label: 'Deletar exame', action: handleDelete }}
        />
        <DetailsPageProperties data={data} />
      </div>
    </>
  );
}
