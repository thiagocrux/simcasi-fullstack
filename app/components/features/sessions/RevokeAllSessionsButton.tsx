'use client';

import { ShieldOff } from 'lucide-react';

import { usePermission } from '@/hooks/usePermission';
import { AppAlertDialog } from '../../common/AppAlertDialog';
import { Button } from '../../ui/button';

interface RevokeAllSessionsButtonProps {
  action: () => void;
}

export function RevokeAllSessionsButton({
  action,
}: RevokeAllSessionsButtonProps) {
  const { can } = usePermission();

  if (!can('delete:session')) {
    return null;
  }

  return (
    <AppAlertDialog
      title="Revogar todas as sessões?"
      description="Esta ação encerrará todas as sessões ativas deste usuário. Ele precisará fazer login novamente."
      cancelAction={{ action: () => {} }}
      continueAction={{ action }}
    >
      <Button
        size="sm"
        variant="outline"
        className="text-destructive hover:text-destructive cursor-pointer select-none"
      >
        <ShieldOff />
        <span>Revogar todas as sessões</span>
      </Button>
    </AppAlertDialog>
  );
}
