'use client';

import { CircleCheck, Copy } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { Button } from '../ui/button';

interface ClipboardCopyButtonProps {
  text: string;
  variant?: 'icon' | 'label';
  className?: string;
}

export function ClipboardCopyButton({
  text,
  variant = 'icon',
  className,
}: ClipboardCopyButtonProps) {
  function handleCopy() {
    navigator.clipboard.writeText(text);
    toast.success('Copiado para a área de transferência', {
      icon: <CircleCheck size={14} />,
    });
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        'p-0! sm:p-1! h-6 cursor-pointer',
        variant === 'label' && ' p-0',
        className
      )}
      onClick={handleCopy}
    >
      {variant === 'label' ? (
        <span
          className={
            'block truncate max-w-40 xs:max-w-55 2xs:max-w-75 3xs:max-w-95 '
          }
          title={text}
        >
          {text}
        </span>
      ) : null}
      <Copy className="ml-1.5 size-3.5 text-muted-foreground shrink-0" />
    </Button>
  );
}
