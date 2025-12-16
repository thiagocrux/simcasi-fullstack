import { Metadata } from 'next';

type MetadataProps = { params: { notificationId: string } };

export function generateMetadata({ params }: MetadataProps): Metadata {
  const isEditMode = !!params.notificationId && params.notificationId !== 'new';

  return {
    title: isEditMode
      ? 'Criar notificação | SIMCASI'
      : 'Editar notificação | SIMCASI',
    description: isEditMode
      ? 'Preencha o formulário para cadastrar uma nova notificação no SIMCASI.'
      : 'Edite as informações de uma notificação no SIMCASI.',
  };
}

export default function NotificationFormPage() {
  return <p>NotificationFormPage</p>;
}
