import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { PatientForm } from '@/app/components/features/patients/PatientForm';

type PatientFormPageProps = { params: Promise<{ patientId: string }> };

export async function generateMetadata({
  params,
}: PatientFormPageProps): Promise<Metadata> {
  const { patientId } = await params;
  const isEditMode = !!patientId && patientId !== 'new';

  return {
    title: !isEditMode
      ? 'Criar paciente | SIMCASI'
      : 'Editar paciente | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar um novo paciente no SIMCASI.'
      : 'Edite as informações de um paciente no SIMCASI.',
  };
}

export default async function PatientFormPage({
  params,
}: PatientFormPageProps) {
  const { patientId } = await params;
  const isEditMode = !!patientId && patientId !== 'new';

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de paciente`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar um novo paciente ao sistema.'
              : 'editar o paciente no sistema.'
          }`}
        />
        <PatientForm isEditMode={isEditMode} patientId={patientId ?? null} />
      </div>
    </>
  );
}
