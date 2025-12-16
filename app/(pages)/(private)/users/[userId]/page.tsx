import { Metadata } from 'next';

type MetadataProps = { params: { userId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.userId && params.userId !== 'new';

  return {
    title: isEditMode ? 'Criar usuário | SIMCASI' : 'Editar usuário | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar um novo usuário no SIMCASI.'
      : 'Edite as informações de um usuário no SIMCASI.',
  };
}

export default function UserFormPage() {
  return <p>UserFormPage</p>;
}
