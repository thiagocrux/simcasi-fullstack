'use client';

import { SquarePen, Trash2 } from 'lucide-react';
import { ReactNode } from 'react';

import { usePermission } from '@/hooks/usePermission';
import { useUser } from '@/hooks/useUser';
import { cn } from '@/lib/shared.utils';
import { Button } from '../ui/button';
import { AppAlertDialog } from './AppAlertDialog';

type Entity =
  | 'role'
  | 'permission'
  | 'session'
  | 'user'
  | 'patient'
  | 'exam'
  | 'notification'
  | 'observation'
  | 'treatment'
  | 'audit-log';

interface DetailsPageActions {
  entity: Entity;
  entityId?: string;
  ownerId?: string;
  dialogTitle: string;
  dialogDescription: string;
  updateAction: {
    label?: string;
    action: () => void;
    hidden?: boolean;
  };
  deleteAction: {
    label?: string;
    action: () => void;
    hidden?: boolean;
  };
  className?: string;
  children?: ReactNode;
}

export function DetailsPageActions({
  entity,
  entityId,
  ownerId,
  dialogTitle,
  dialogDescription,
  updateAction,
  deleteAction,
  className,
  children,
}: DetailsPageActions) {
  const { can } = usePermission();
  const { user, isUserAdmin, isHealthProfessional } = useUser();

  const isSelf = entity === 'user' && entityId === user?.id;
  const showUpdateButton =
    can(`update:${entity}`) &&
    (isUserAdmin || isSelf || entity !== 'user') &&
    !updateAction.hidden;

  const isOwner = !!ownerId && user?.id === ownerId;
  const isSessionEntity = entity === 'session';
  const showDeleteButton = !deleteAction.hidden && (
    (isSessionEntity && (isUserAdmin || isHealthProfessional || isOwner)) ||
    (!isSessionEntity && can(`delete:${entity}`) && isUserAdmin)
  );

  if (!showUpdateButton && !showDeleteButton && !children) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex xs:flex-row flex-col justify-center items-stretch sm:items-center gap-2',
        className
      )}
    >
      {showUpdateButton ? (
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer select-none"
          onClick={updateAction.action}
        >
          <SquarePen />
          {updateAction.label && <span>{updateAction.label}</span>}
        </Button>
      ) : null}

      {showDeleteButton ? (
        <AppAlertDialog
          title={dialogTitle}
          description={dialogDescription}
          cancelAction={{ action: () => {} }}
          continueAction={{ action: deleteAction.action }}
        >
          <Button
            size="sm"
            variant="outline"
            className="text-destructive cursor-pointer select-none"
            onClick={deleteAction.action}
          >
            <Trash2 />
            {deleteAction.label && <span>{deleteAction.label}</span>}
          </Button>
        </AppAlertDialog>
      ) : null}

      {children}
    </div>
  );
}
