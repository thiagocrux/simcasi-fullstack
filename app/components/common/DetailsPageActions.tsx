'use client';

import { SquarePen, Trash2 } from 'lucide-react';

import { usePermission } from '@/hooks/usePermission';
import { cn } from '@/lib/shared.utils';
import { Button } from '../ui/button';
import { AppAlertDialog } from './AppAlertDialog';

type Entity =
  | 'role'
  | 'permission'
  | 'session '
  | 'user'
  | 'patient'
  | 'exam'
  | 'notification'
  | 'observation'
  | 'treatment'
  | 'audit-log';

interface DetailsPageActions {
  entity: Entity;
  dialogTitle: string;
  dialogDescription: string;
  updateAction: {
    label?: string;
    action: () => void;
  };
  deleteAction: {
    label?: string;
    action: () => void;
  };
  className?: string;
}

export function DetailsPageActions({
  entity,
  dialogTitle,
  dialogDescription,
  updateAction,
  deleteAction,
  className,
}: DetailsPageActions) {
  const { can } = usePermission();

  if (!can(`update:${entity}`) && !can(`delete:${entity}`)) {
    return null;
  }

  return (
    <div
      className={cn(
        'flex xs:flex-row flex-col justify-center items-stretch sm:items-center gap-2',
        className
      )}
    >
      {can(`update:${entity}`) ? (
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

      {can(`delete:${entity}`) ? (
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
    </div>
  );
}
