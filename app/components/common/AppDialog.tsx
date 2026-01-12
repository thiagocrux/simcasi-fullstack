'use client';

import { ReactNode } from 'react';

import { Button } from '../ui/button';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

interface AppDialogProps {
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
  triggerComponent?: ReactNode;
  children?: ReactNode;
  showCloseButton?: boolean;
}

export function AppDialog({
  title,
  description,
  cancelAction,
  continueAction,
  triggerComponent,
  children,
  showCloseButton = true,
}: AppDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <>{triggerComponent}</>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        showCloseButton={showCloseButton}
      >
        <DialogHeader>
          {title && <DialogTitle>{title}</DialogTitle>}
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children ? <>{children}</> : null}
        <DialogFooter>
          {cancelAction && (
            <DialogClose asChild>
              <Button variant="outline">{cancelAction?.label}</Button>
            </DialogClose>
          )}
          {continueAction && (
            <Button onClick={continueAction?.action}>
              {continueAction?.label}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
