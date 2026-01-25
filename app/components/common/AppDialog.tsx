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
import { ReactNode } from 'react';

interface AppDialogProps {
  isOpen: boolean;
  children: ReactNode;
  title?: string;
  description?: string;
  customContent?: ReactNode;
  cancelAction?: {
    label?: string;
    action: () => void;
  };
  continueAction?: {
    label?: string;
    action: () => void;
  };
}

export function AppDialog({
  isOpen,
  children,
  title,
  description,
  customContent,
  cancelAction,
  continueAction,
}: AppDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {isOpen && (
        <DialogContent className="sm:max-w-[425px]">
          {title || description ? (
            <DialogHeader>
              {title ? <DialogTitle>{title}</DialogTitle> : null}
              {description ? (
                <DialogDescription className="text-sm">
                  {description}
                </DialogDescription>
              ) : null}
            </DialogHeader>
          ) : null}
          {customContent ? <>{customContent}</> : null}
          <DialogFooter>
            {cancelAction ? (
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  onClick={cancelAction?.action}
                >
                  {cancelAction?.label}
                </Button>
              </DialogClose>
            ) : null}
            {continueAction ? (
              <Button type="button" onClick={continueAction.action}>
                {continueAction.label}
              </Button>
            ) : null}
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}
