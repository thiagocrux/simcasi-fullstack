import { Metadata } from 'next';

type MetadataProps = { params: { examId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.examId && params.examId !== 'new';

  return {
    title: isEditMode ? 'Criar exame | SIMCASI' : 'Editar exame | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar um novo exame no SIMCASI.'
      : 'Edite as informações de um exame no SIMCASI.',
  };
}

export default function ExamFormPage() {
  return <p>ExamFormPage</p>;
}
