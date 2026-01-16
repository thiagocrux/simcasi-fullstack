import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { ExamForm } from '@/app/components/features/exams/ExamForm';

type ExamFormPageProps = {
  params: Promise<{ examId: string; patientId: string }>;
};

export async function generateMetadata({
  params,
}: ExamFormPageProps): Promise<Metadata> {
  const { examId } = await params;
  const isEditMode = !!examId && examId !== 'new';

  return {
    title: !isEditMode ? 'Criar exame | SIMCASI' : 'Editar exame | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar um novo exame no SIMCASI.'
      : 'Edite as informações de um exame no SIMCASI.',
  };
}

export default async function ExamFormPage({ params }: ExamFormPageProps) {
  const { examId, patientId } = await params;
  const isEditMode = !!examId && examId !== 'new';

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${!isEditMode ? 'criação' : 'edição'} de exame`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar um novo exame ao sistema.'
              : 'editar o exame no sistema.'
          }`}
        />
        <ExamForm
          isEditMode={isEditMode}
          examId={examId ?? null}
          patientId={patientId}
        />
      </div>
    </>
  );
}
