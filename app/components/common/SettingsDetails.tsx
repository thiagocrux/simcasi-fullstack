'use client';

import { revokeAllSessionsByUserId } from '@/app/actions/session.actions';
import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';
import { AppAlertDialog } from './AppAlertDialog';
import { ThemeSwitcher } from './ThemeSwitcher';

export function SettingsDetails() {
  const router = useRouter();
  const { user } = useUser();

  async function handleRevokeAllSessions() {
    if (user?.id) {
      await revokeAllSessionsByUserId(user.id);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Aparência */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Aparência</h4>
        <p className="text-muted-foreground text-sm">
          Personalize a aparência visual da interface.
        </p>
      </div>

      <Card>
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 px-6 py-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Tema</p>
            <p className="text-muted-foreground text-sm">
              Escolha entre tema claro, escuro ou automático conforme o sistema
              operacional.
            </p>
          </div>
          <ThemeSwitcher showLabel selectClasses="w-full sm:w-auto" />
        </div>
      </Card>

      <Separator />

      {/* Conta */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Conta</h4>
        <p className="text-muted-foreground text-sm">
          Gerencie as credenciais de acesso à sua conta.
        </p>
      </div>

      <Card>
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 px-6 py-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Senha</p>
            <p className="text-muted-foreground text-sm">
              Altere a senha de acesso à sua conta.
            </p>
          </div>
          <Button
            variant="outline"
            className="w-full sm:w-auto cursor-pointer"
            onClick={() => router.push(`/users/${user?.id}/change-password`)}
          >
            Alterar senha
          </Button>
        </div>
      </Card>

      <Separator />

      {/* Sessões */}
      <div className="space-y-2">
        <h4 className="font-bold text-xl leading-none">Sessões</h4>
        <p className="text-muted-foreground text-sm">
          Gerencie as sessões ativas associadas à sua conta.
        </p>
      </div>

      <Card>
        <div className="flex sm:flex-row flex-col sm:items-center gap-3 px-6 py-4">
          <div className="flex-1 min-w-0">
            <p className="font-medium text-sm">Encerrar todas as sessões</p>
            <p className="text-muted-foreground text-sm">
              Remove o acesso de todos os dispositivos conectados. Você será
              redirecionado para a página de login.
            </p>
          </div>
          <AppAlertDialog
            title="Encerrar todas as sessões?"
            description="Esta ação encerrará todas as suas sessões ativas. Você será redirecionado para a página de login."
            cancelAction={{ action: () => {} }}
            continueAction={{ action: handleRevokeAllSessions }}
          >
            <Button
              variant="destructive"
              className="w-full sm:w-auto cursor-pointer"
            >
              Encerrar sessões
            </Button>
          </AppAlertDialog>
        </div>
      </Card>
    </div>
  );
}
