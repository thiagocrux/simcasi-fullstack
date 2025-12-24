import { Metadata } from 'next';

import { UserForm } from '@/app/components/features/users/UserForm';
import { Card } from '@/app/components/ui/card';

type UserFormPageProps = { params: Promise<{ userId: string }> };

export async function generateMetadata({
  params,
}: UserFormPageProps): Promise<Metadata> {
  const { userId } = await params;
  const isEditMode = !!userId && userId !== 'new';

  return {
    title: !isEditMode ? 'Criar usuário | SIMCASI' : 'Editar usuário | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar um novo usuário no SIMCASI.'
      : 'Edite as informações de um usuário no SIMCASI.',
  };
}

export default async function UserFormPage({ params }: UserFormPageProps) {
  const { userId } = await params;
  const isEditMode = userId && userId !== 'new';

  return (
    <>
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário  de ${
            !isEditMode ? 'criação' : 'edição'
          } de usuário`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar um novo usuário ao sistema.'
                : 'editar o usuário no sistema.'
            }`}
          </p>
        </div>
        <UserForm />
      </Card>
    </>
  );
}
