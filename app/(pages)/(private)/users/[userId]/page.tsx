import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { UserForm } from '@/app/components/features/users/UserForm';

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
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de usuário`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar um novo usuário ao sistema.'
              : 'editar o usuário no sistema.'
          }`}
        />
        <UserForm />
      </div>
    </>
  );
}
