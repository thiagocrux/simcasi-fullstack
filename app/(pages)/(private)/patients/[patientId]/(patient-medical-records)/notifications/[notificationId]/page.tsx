import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { NotificationForm } from '@/app/components/features/notifications/NotificationForm';

type NotificationFormPageProps = {
  params: Promise<{ notificationId: string; patientId: string }>;
};

export async function generateMetadata({
  params,
}: NotificationFormPageProps): Promise<Metadata> {
  const { notificationId } = await params;
  const isEditMode = !!notificationId && notificationId !== 'new';

  return {
    title: !isEditMode
      ? 'Criar notificação | SIMCASI'
      : 'Editar notificação | SIMCASI',
    description: !isEditMode
      ? 'Preencha o formulário para cadastrar uma nova notificação no SIMCASI.'
      : 'Edite as informações de uma notificação no SIMCASI.',
  };
}

export default async function NotificationFormPage({
  params,
}: NotificationFormPageProps) {
  const { notificationId, patientId } = await params;
  const isEditMode = !!notificationId && notificationId !== 'new';

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title={`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de notificação`}
          description={`${
            !isEditMode ? 'Preencha' : 'Atualize'
          } as informações abaixo para ${
            !isEditMode
              ? 'adicionar uma nova notificação ao sistema.'
              : 'editar a notificação no sistema.'
          }`}
        />
        <NotificationForm
          isEditMode={isEditMode}
          notificationId={notificationId ?? null}
          patientId={patientId}
        />
      </div>
    </>
  );
}
