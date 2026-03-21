'use client';

import { revokeAllSessionsByUserId } from '@/app/actions/session.actions';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { AppAlertDialog } from './AppAlertDialog';

export function SettingsDetails() {
  const router = useRouter();
  const { user } = useUser();

  async function handleRevokeAllSessions() {
    if (user?.id) {
      await revokeAllSessionsByUserId(user.id);
    }
  }

  return (
    <Card className="flex flex-col items-start gap-8 px-8 py-6 text-sm">
      <div className="flex flex-col w-full">
        <p className="font-medium text-lg">Conta</p>
        <Separator className="" />
        <Button
          variant="link"
          className="px-0 w-min cursor-pointer"
          onClick={() => router.push(`/users/${user?.id}/change-password`)}
        >
          Atualizar senha
        </Button>
      </div>
      <div className="flex flex-col w-full">
        <p className="font-medium text-lg">Sessões</p>
        <Separator className="" />
        <AppAlertDialog
          title="Encerrar todas as sessões?"
          description="Esta ação encerrará todas as suas sessões ativas. Você será redirecionado para a página de login."
          cancelAction={{ action: () => {} }}
          continueAction={{ action: handleRevokeAllSessions }}
        >
          <Button
            variant="link"
            className="px-0 w-min text-destructive cursor-pointer"
          >
            Encerrar todas as minhas sessões
          </Button>
        </AppAlertDialog>
      </div>
    </Card>
  );
}
