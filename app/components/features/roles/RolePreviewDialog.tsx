'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Role } from '@/core/domain/entities/role.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface RolePreviewDialogProps {
  title: string;
  description: string;
  role: Role;
  children: ReactNode;
}

export function RolePreviewDialog({
  title,
  description,
  role,
  children,
}: RolePreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'Nome',
      value: role?.label || '-',
    },
    {
      label: 'Código identificador',
      value: role?.code || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !role ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !role
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () => router.push(`/roles/${role.id}/details`),
            }
      }
      content={
        !role ? (
          <NotFoundPreviewContent />
        ) : (
          <PreviewDialogContent fields={fields} />
        )
      }
    >
      {children}
    </AppDialog>
  );
}
