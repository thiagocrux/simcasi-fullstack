'use client';

import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';

import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/app/components/ui/dialog';
import { cn } from '@/lib/shared.utils';

type Action = {
  action: () => void;
  label?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  hidden?: boolean;
};
interface AppDialogProps {
  open?: boolean;
  title?: string;
  description?: string;
  cancelAction?: Action;
  continueAction?: Action;
  children?: ReactNode;
  content?: ReactNode;
  className?: string;
}

export function AppDialog({
  open,
  title,
  description,
  cancelAction,
  continueAction,
  children,
  content,
  className,
}: AppDialogProps) {
  return (
    <Dialog open={open}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className={cn('sm:max-w-lg', className)}>
        {title || description ? (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}

            {description && (
              <DialogDescription className="text-sm">
                {description}
              </DialogDescription>
            )}
          </DialogHeader>
        ) : null}

        {content}

        {cancelAction || continueAction ? (
          <DialogFooter>
            {cancelAction && !cancelAction.hidden ? (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  disabled={cancelAction.disabled}
                  className="cursor-pointer"
                  onClick={cancelAction?.action}
                >
                  {cancelAction.icon ? <cancelAction.icon /> : null}
                  {cancelAction?.label ?? 'Cancelar'}
                </Button>
              </DialogClose>
            ) : null}

            {continueAction && !continueAction.hidden ? (
              <Button
                type="button"
                disabled={continueAction.disabled}
                className="cursor-pointer"
                onClick={continueAction.action}
              >
                {continueAction.icon ? <continueAction.icon /> : null}
                {continueAction.label ?? 'Prosseguir'}
              </Button>
            ) : null}
          </DialogFooter>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
