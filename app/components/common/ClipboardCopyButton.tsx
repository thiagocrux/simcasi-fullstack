'use client';

import { Copy } from 'lucide-react';
import { toast } from 'sonner';

import { cn } from '@/lib/shared.utils';
import { Button } from '../ui/button';

interface ClipboardCopyButtonProps {
  value: string;
  label?: string;
  variant?: 'icon' | 'label' | 'button';
  className?: string;
}

export function ClipboardCopyButton({
  value,
  label,
  variant = 'button',
  className,
}: ClipboardCopyButtonProps) {
  function handleCopy() {
    navigator.clipboard.writeText(value);
    toast.success('Copiado para a área de transferência.');
  }

  return (
    <>
      {variant === 'label' ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn('p-0! sm:p-1! h-6 cursor-pointer', className)}
          onClick={handleCopy}
        >
          <span
            className={
              'block truncate max-w-40 xs:max-w-55 2xs:max-w-75 3xs:max-w-95'
            }
            title={value}
          >
            {value}
          </span>
          <Copy className="ml-1.5 size-3.5 text-muted-foreground shrink-0" />
        </Button>
      ) : null}

      {variant === 'icon' ? (
        <Button
          variant="ghost"
          size="sm"
          className={cn('p-0! sm:p-1! h-6 cursor-pointer', className)}
          onClick={handleCopy}
        >
          <Copy className="ml-1.5 size-3.5 text-muted-foreground shrink-0" />
        </Button>
      ) : null}

      {variant === 'button' ? (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer select-none"
          onClick={handleCopy}
        >
          {label || value}
          <Copy />
        </Button>
      ) : null}
    </>
  );
}
