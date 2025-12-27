'use client';

import { ReactNode } from 'react';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../ui/alert-dialog';

interface AlertDialogProps {
  title?: string;
  description?: string;
  cancelAction?: {
    label?: string;
    action: () => void;
  };
  continueAction?: {
    label?: string;
    action: () => void;
  };
  children: ReactNode;
}

export function AppAlertDialog({
  title,
  description,
  cancelAction,
  continueAction,
  children,
}: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {cancelAction ? (
            <AlertDialogCancel
              onClick={cancelAction.action}
              className="cursor-pointer"
            >
              {cancelAction.label ?? 'Cancelar'}
            </AlertDialogCancel>
          ) : null}
          {continueAction ? (
            <AlertDialogAction
              onClick={continueAction.action}
              className="cursor-pointer"
            >
              {continueAction.label ?? 'Prosseguir'}
            </AlertDialogAction>
          ) : null}
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
