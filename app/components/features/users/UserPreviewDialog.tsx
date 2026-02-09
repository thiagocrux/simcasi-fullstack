'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { User } from '@/core/domain/entities/user.entity';
import { useRole } from '@/hooks/useRole';
import { AppDialog } from '../../common/AppDialog';
import { ClipboardCopyButton } from '../../common/ClipboardCopyButton';

interface UserPreviewDialogProps {
  title: string;
  description: string;
  user: Omit<User, 'password'>;
  children: ReactNode;
}

export function UserPreviewDialog({
  title,
  description,
  user,
  children,
}: UserPreviewDialogProps) {
  const router = useRouter();
  const { getRoleLabel } = useRole();

  const fields = [
    {
      label: 'Nome',
      value: user?.name || '-',
    },
    {
      label: 'E-mail',
      value: user?.email || '-',
    },
    {
      label: 'Nível de permissão',
      value: user?.roleId ? getRoleLabel(user.roleId) : '-',
    },
  ];

  if (!user) {
    return '-';
  }

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: 'Cancelar',
        action: () => {},
      }}
      continueAction={{
        label: 'Acessar o perfil completo',
        action: () => router.push(`/users/${user.id}/details`),
      }}
      content={
        <div className="flex flex-col gap-0.5 overflow-hidden text-sm">
          {fields.map((field) => (
            <div
              key={`${field.label}-${field.value}`}
              className="flex sm:flex-row flex-col items-start sm:items-center"
            >
              <p className="text-muted-foreground">{field.label}</p>
              <div className="flex-1 mx-2 border-b border-dashed" />
              {field.value && (
                <ClipboardCopyButton text={field.value} variant="label" />
              )}
            </div>
          ))}
        </div>
      }
    >
      {children}
    </AppDialog>
  );
}
