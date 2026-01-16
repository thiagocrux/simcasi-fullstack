import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { mockExams } from '@/lib/mock.utils';

export const metadata: Metadata = {
  title: 'Detalhes do exame | SIMCASI',
  description: 'Consulte as informações detalhadas deste exame no SIMCASI.',
};

interface ExamDetailsPageProps {
  params: Promise<{ examId: string }>;
}

export default async function ExamDetailsPage({
  params,
}: ExamDetailsPageProps) {
  const { examId } = await params;

  // --- TODO: Replace the logic below with the actual action call
  const exam = mockExams.find((exam) => exam.id === examId);

  const data = [
    {
      title: 'Teste Treponêmico',
      fields: [
        { label: 'Tipo', value: exam?.treponemalTestType },
        { label: 'Resultado', value: exam?.treponemalTestResult },
        {
          label: 'Data',
          value: Intl.DateTimeFormat('pt-BR').format(exam?.treponemalTestDate),
        },
        { label: 'Local', value: exam?.treponemalTestLocation },
      ],
    },
    {
      title: 'Teste Não Treponêmico',
      fields: [
        { label: 'VDRL', value: exam?.nontreponemalVdrlTest },
        { label: 'Titulação', value: exam?.nontreponemalTestTitration },
        {
          label: 'Data',
          value: Intl.DateTimeFormat('pt-BR').format(
            exam?.nontreponemalTestDate
          ),
        },
      ],
    },
    {
      title: 'Outros',
      fields: [
        {
          label: 'Outro teste não treponêmico',
          value: exam?.otherNontreponemalTest,
        },
        {
          label: 'Data do outro teste não treponêmico',
          value: exam?.otherNontreponemalTestDate
            ? Intl.DateTimeFormat('pt-BR').format(
                exam?.otherNontreponemalTestDate
              )
            : null,
        },
        {
          label: 'Observações de referência',
          value: exam?.referenceObservations,
        },
      ],
    },
  ];

  async function handleUpdate() {
    'use server';
    redirect(`/patients/${exam?.patientId}/exams/${exam?.id}`);
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
