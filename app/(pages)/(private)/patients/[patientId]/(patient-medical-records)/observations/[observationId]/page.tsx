import { Metadata } from 'next';

type MetadataProps = { params: { observationId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.observationId && params.observationId !== 'new';

  return {
    title: isEditMode
      ? 'Criar observação | SIMCASI'
      : 'Editar observação | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar uma nova observação no SIMCASI.'
      : 'Edite as informações de uma observação no SIMCASI.',
  };
}

export default function ObservationFormPage() {
  return <p>ObservationFormPage</p>;
}
