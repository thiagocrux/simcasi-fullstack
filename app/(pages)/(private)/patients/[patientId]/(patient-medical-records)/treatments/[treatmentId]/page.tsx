import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { TreatmentForm } from '@/app/components/features/treatments/TreatmentForm';

type TreatmentFormPageProps = { params: { treatmentId: string } };

export async function generateMetadata({
  params,
}: TreatmentFormPageProps): Promise<Metadata> {
  const { treatmentId } = await params;
  const isEditMode = !!treatmentId && treatmentId !== 'new';

  return {
    title: !isEditMode
      ? 'Criar tratamento | SIMCASI'
      : 'Editar tratamento | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar um novo tratamento no SIMCASI.'
      : 'Edite as informações de um tratamento no SIMCASI.',
  };
}

export default async function TreatmentFormPage({
  params,
}: TreatmentFormPageProps) {
  const { treatmentId } = await params;
  const isEditMode = !!treatmentId && treatmentId !== 'new';

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de tratamento`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar um novo tratamento ao sistema.'
              : 'editar o tratamento no sistema.'
          }`}
        />
        <TreatmentForm isEditMode={isEditMode} />
      </div>
    </>
  );
}
