import { Metadata } from 'next';

import { ObservationForm } from '@/app/components/features/observations/ObservationForm';
import { Card } from '@/app/components/ui/card';

type ObservationFormPageProps = { params: { observationId: string } };

export function generateMetadata({
  params,
}: ObservationFormPageProps): Metadata {
  const { observationId } = params;
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

export default function ObservationFormPage({
  params,
}: ObservationFormPageProps) {
  const { observationId } = params;
  const isEditMode = !!observationId && observationId !== 'new';

  return (
    <>
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de observação`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar uma nova observação ao sistema.'
                : 'editar a observação no sistema.'
            }`}
          </p>
        </div>
        <ObservationForm isEditMode={isEditMode} />
      </Card>
    </>
  );
}
