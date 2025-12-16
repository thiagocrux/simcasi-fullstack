import { Metadata } from 'next';

type MetadataProps = { params: { treatmentId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.treatmentId && params.treatmentId !== 'new';

  return {
    title: isEditMode
      ? 'Criar tratamento | SIMCASI'
      : 'Editar tratamento | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar um novo tratamento no SIMCASI.'
      : 'Edite as informações de um tratamento no SIMCASI.',
  };
}

export default function TreatmentFormPage() {
  return <p>TreatmentFormPage</p>;
}
