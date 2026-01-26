import { Metadata } from 'next';
import { redirect } from 'next/navigation';

import { deleteExam, getExam } from '@/app/actions/exam.actions';
import { DetailsPageActions } from '@/app/components/common/DetailsPageActions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { Exam } from '@/core/domain/entities/exam.entity';
import { ActionResponse } from '@/lib/actions.utils';
import { notFound } from 'next/navigation';

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

  const response: ActionResponse<Exam> = await getExam(examId);

  if (!response.success || !response.data) {
    notFound();
  }

  const exam = response.data;

  const data = [
    {
      title: 'Teste Treponêmico',
      fields: [
        { label: 'Tipo', value: exam?.treponemalTestType },
        { label: 'Resultado', value: exam?.treponemalTestResult },
        {
          label: 'Data',
          value: exam?.treponemalTestDate
            ? Intl.DateTimeFormat('pt-BR').format(
                new Date(exam.treponemalTestDate)
              )
            : '-',
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
          value: exam?.nontreponemalTestDate
            ? Intl.DateTimeFormat('pt-BR').format(
                new Date(exam.nontreponemalTestDate)
              )
            : '-',
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
                new Date(exam.otherNontreponemalTestDate)
              )
            : '-',
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
    deleteExam(examId);
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
