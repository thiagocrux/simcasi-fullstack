import { Metadata } from 'next';

import { ExamForm } from '@/app/components/features/exams/ExamForm';
import { Card } from '@/app/components/ui/card';

type ExamFormPageProps = { params: { examId: string } };

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
  const { examId } = await params;
  const isEditMode = !!examId && examId !== 'new';

  return (
    <>
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário  de ${
            !isEditMode ? 'criação' : 'edição'
          } de exame`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar um novo exame ao sistema.'
                : 'editar o exame no sistema.'
            }`}
          </p>
        </div>
        <ExamForm isEditMode={isEditMode} />
      </Card>
    </>
  );
}
