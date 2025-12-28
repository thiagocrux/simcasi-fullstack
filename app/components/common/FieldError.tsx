'use client';

import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

interface FieldErrorProps {
  message: string | undefined;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <span
      className={cn(
        'font-normal text-destructive text-sm group-has-data-[orientation=horizontal]/field:text-balance leading-normal',
        'last:mt-0 nth-last-2:-mt-1 [[data-variant=legend]+&]:-mt-1.5',
        '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
        className
      )}
    >
      <ReactMarkdown>{message}</ReactMarkdown>
    </span>
  );
}
