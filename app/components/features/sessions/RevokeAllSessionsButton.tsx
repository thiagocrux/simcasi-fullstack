'use client';

import { ShieldOff } from 'lucide-react';

import { useUser } from '@/hooks/useUser';
import { AppAlertDialog } from '../../common/AppAlertDialog';
import { Button } from '../../ui/button';

interface RevokeAllSessionsButtonProps {
  targetUserId: string;
  action: () => void;
}

/**
 * Button component to trigger the revocation of all sessions for a specific user.
 * 
 * Visibility Rules:
 * - Shown for Admin and Health Professional roles.
 * - Shown for the session owner (self-service).
 */
export function RevokeAllSessionsButton({
  targetUserId,
  action,
}: RevokeAllSessionsButtonProps) {
  const { user: loggedUser, isUserAdmin, isHealthProfessional } = useUser();

  const isOwnAccount = targetUserId === loggedUser?.id;
  const canRevoke = isUserAdmin || isHealthProfessional || isOwnAccount;

  if (!canRevoke) {
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
