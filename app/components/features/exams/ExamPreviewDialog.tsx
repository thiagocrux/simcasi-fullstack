'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Exam } from '@/core/domain/entities/exam.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface ExamPreviewDialogProps {
  title: string;
  description: string;
  exam: Exam;
  children: ReactNode;
}

export function ExamPreviewDialog({
  title,
  description,
  exam,
  children,
}: ExamPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'ID do Paciente',
      value: exam?.patientId || '-',
    },
    {
      label: 'Tipo do Teste (Treponêmico)',
      value: exam?.treponemalTestType || '-',
    },
    {
      label: 'Resultado (Treponêmico)',
      value: exam?.treponemalTestResult || '-',
    },
    {
      label: 'Resultado VDRL',
      value: exam?.nontreponemalVdrlTest || '-',
    },
    {
      label: 'Titulação',
      value: exam?.nontreponemalTestTitration || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !exam ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !exam
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () => router.push(`/exams/${exam.id}/details`),
            }
      }
      content={
        !exam ? (
          <NotFoundPreviewContent />
        ) : (
          <PreviewDialogContent fields={fields} />
        )
      }
    >
      {children}
    </AppDialog>
  );
}
