import { Metadata } from 'next';

type MetadataProps = { params: { patientId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.patientId && params.patientId !== 'new';

  return {
    title: isEditMode
      ? 'Criar paciente | SIMCASI'
      : 'Editar paciente | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar um novo paciente no SIMCASI.'
      : 'Edite as informações de um paciente no SIMCASI.',
  };
}

export default function PatientFormPage() {
  return <p>PatientFormPage</p>;
}
