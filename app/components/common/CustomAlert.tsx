import { AlertTriangle, CircleCheck, CircleX, InfoIcon } from 'lucide-react';
import { ReactNode } from 'react';
import ReactMarkdown from 'react-markdown';

import { cn } from '@/lib/shared.utils';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

type Variant = 'default' | 'info' | 'success' | 'warning' | 'danger';

interface CustomAlertProps {
  title?: string;
  description?: string;
  variant?: Variant;
  children?: ReactNode;
  className?: string;
}

export function CustomAlert({
  title,
  description,
  variant = 'default',
  children,
  className,
}: CustomAlertProps) {
  const variantMapper: Record<Variant, { icon: ReactNode; style: string }> = {
    default: {
      icon: <InfoIcon strokeWidth={2} />,
      style: '',
    },
    info: {
      icon: <InfoIcon strokeWidth={2} />,
      style:
        'bg-sky-100 dark:bg-sky-800 border-sky-600 dark:border-sky-600 text-sky-600 dark:text-sky-400',
    },
    success: {
      icon: <CircleCheck strokeWidth={2} />,
      style:
        'bg-green-200 dark:bg-teal-600 border-green-600 dark:border-green-600 text-green-600 dark:text-green-200',
    },
    warning: {
      icon: <AlertTriangle strokeWidth={2} />,
      style:
        'bg-amber-100 dark:bg-amber-600 border-amber-600 dark:border-amber-500 text-amber-600 dark:text-amber-200',
    },
    danger: {
      icon: <CircleX strokeWidth={2} />,
      style:
        'bg-red-200 dark:bg-red-800 border-red-600 dark:border-red-600 text-red-600 dark:text-red-300',
    },
  };

  return (
    <Alert className={cn(`${variantMapper[variant].style}`, className)}>
      {variantMapper[variant].icon}
      {title ? (
        <AlertTitle className="font-semibold">{title}</AlertTitle>
      ) : null}
      {description ? (
        <AlertDescription className={variantMapper[variant].style}>
          <ReactMarkdown>{description}</ReactMarkdown>
        </AlertDescription>
      ) : null}
      {children}
    </Alert>
  );
}
