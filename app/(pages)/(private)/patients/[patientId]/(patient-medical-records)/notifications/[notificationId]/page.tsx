import { Metadata } from 'next';

import { NotificationForm } from '@/app/components/features/notifications/NotificationForm';
import { Card } from '@/app/components/ui/card';

type NotificationFormPageProps = { params: { notificationId: string } };

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
  const { notificationId } = await params;
  const isEditMode = !!notificationId && notificationId !== 'new';

  return (
    <>
      <Card className="flex flex-col p-6 max-w-3xl">
        <div>
          <h1 className="font-bold text-xl">{`Formulário de ${
            !isEditMode ? 'criação' : 'edição'
          } de notificação`}</h1>
          <p className="text-muted-foreground text-sm">
            {`${
              !isEditMode ? 'Preencha' : 'Atualize'
            } as informações abaixo para ${
              !isEditMode
                ? 'adicionar uma nova notificação ao sistema.'
                : 'editar a notificação no sistema.'
            }`}
          </p>
        </div>
        <NotificationForm isEditMode={isEditMode} />
      </Card>
    </>
  );
}
