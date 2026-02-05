'use client';

import { ReactNode } from 'react';

import { cn } from '@/lib/shared.utils';
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

type Action = {
  action: () => void;
  label?: string;
  disabled?: boolean;
  hidden?: boolean;
};

interface AlertDialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  cancelAction?: Action;
  continueAction?: Action;
  children?: ReactNode;
  content?: ReactNode;
  className?: string;
}

export function AppAlertDialog({
  open,
  title,
  description,
  cancelAction,
  continueAction,
  children,
  content,
  className,
}: AlertDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>

      <AlertDialogContent className={cn('sm:max-w-lg', className)}>
        {title || description ? (
          <AlertDialogHeader>
            {title && <AlertDialogTitle>{title}</AlertDialogTitle>}

            {description && (
              <AlertDialogDescription>{description}</AlertDialogDescription>
            )}
          </AlertDialogHeader>
        ) : null}

        {content}

        {cancelAction || continueAction ? (
          <AlertDialogFooter>
            {cancelAction && !cancelAction.hidden ? (
              <AlertDialogCancel
                onClick={cancelAction.action}
                className="cursor-pointer"
                disabled={cancelAction?.disabled}
              >
                {cancelAction.label ?? 'Cancelar'}
              </AlertDialogCancel>
            ) : null}

            {continueAction && !continueAction.hidden ? (
              <AlertDialogAction
                onClick={continueAction.action}
                className="cursor-pointer"
                disabled={continueAction?.disabled}
              >
                {continueAction.label ?? 'Prosseguir'}
              </AlertDialogAction>
            ) : null}
          </AlertDialogFooter>
        ) : null}
      </AlertDialogContent>
    </AlertDialog>
  );
}
