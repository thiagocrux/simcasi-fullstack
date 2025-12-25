import { Metadata } from 'next';

import { PatientForm } from '@/app/components/features/patients/PatientForm';
import { Card } from '@/app/components/ui/card';

type PatientFormPageProps = { params: { patientId: string } };

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
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de paciente`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar um novo paciente ao sistema.'
                : 'editar o paciente no sistema.'
            }`}
          </p>
        </div>
        <PatientForm />
      </Card>
    </>
  );
}
