'use client';

import { SquarePen, Trash2 } from 'lucide-react';

import { Button } from '../ui/button';
import { AppAlertDialog } from './AppAlertDialog';

interface DetailsPageActions {
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
}

export function DetailsPageActions({
  dialogTitle,
  dialogDescription,
  updateAction,
  deleteAction,
}: DetailsPageActions) {
  return (
    <div className="flex xs:flex-row flex-col justify-start items-stretch sm:items-center gap-2">
      <Button
        size="sm"
        variant="default"
        className="cursor-pointer select-none"
        onClick={updateAction.action}
      >
        <SquarePen />
        {updateAction.label && <span>{updateAction.label}</span>}
      </Button>
      <AppAlertDialog
        title={dialogTitle}
        description={dialogDescription}
        cancelAction={{ action: () => {} }}
        continueAction={{ action: deleteAction.action }}
      >
        <Button
          size="sm"
          variant="destructive"
          className="cursor-pointer select-none"
          onClick={deleteAction.action}
        >
          <Trash2 />
          {deleteAction.label && <span>{deleteAction.label}</span>}
        </Button>
      </AppAlertDialog>
    </div>
  );
}
