import { Metadata } from 'next';

import { TreatmentForm } from '@/app/components/features/treatments/TreatmentForm';
import { Card } from '@/app/components/ui/card';

type TreatmentFormPageProps = { params: { treatmentId: string } };

export function generateMetadata({ params }: TreatmentFormPageProps): Metadata {
  const { treatmentId } = params;
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

export default function TreatmentFormPage({ params }: TreatmentFormPageProps) {
  const { treatmentId } = params;
  const isEditMode = !!treatmentId && treatmentId !== 'new';

  return (
    <>
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de tratamento`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar um novo tratamento ao sistema.'
                : 'editar o tratamento no sistema.'
            }`}
          </p>
        </div>
        <TreatmentForm isEditMode={isEditMode} />
      </Card>
    </>
  );
}
