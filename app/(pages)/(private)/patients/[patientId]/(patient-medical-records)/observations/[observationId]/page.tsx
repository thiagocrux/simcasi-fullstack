import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { ObservationForm } from '@/app/components/features/observations/ObservationForm';

type ObservationFormPageProps = {
  params: Promise<{ observationId: string; patientId: string }>;
};

export async function generateMetadata({
  params,
}: ObservationFormPageProps): Promise<Metadata> {
  const { observationId } = await params;
  const isEditMode = !!observationId && observationId !== 'new';

  return {
    title: !isEditMode
      ? 'Criar observação | SIMCASI'
      : 'Editar observação | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar uma nova observação no SIMCASI.'
      : 'Edite as informações de uma observação no SIMCASI.',
  };
}

export default async function ObservationFormPage({
  params,
}: ObservationFormPageProps) {
  const { observationId, patientId } = await params;
  const isEditMode = !!observationId && observationId !== 'new';

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de observação`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar uma nova observação ao sistema.'
              : 'editar a observação no sistema.'
          }`}
        />
        <ObservationForm
          isEditMode={isEditMode}
          observationId={observationId ?? null}
          patientId={patientId}
        />
      </div>
    </>
  );
}
