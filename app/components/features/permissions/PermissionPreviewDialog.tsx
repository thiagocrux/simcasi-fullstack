'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { Permission } from '@/core/domain/entities/permission.entity';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

interface PermissionPreviewDialogProps {
  title: string;
  description: string;
  permission: Permission;
  children: ReactNode;
}

export function PermissionPreviewDialog({
  title,
  description,
  permission,
  children,
}: PermissionPreviewDialogProps) {
  const router = useRouter();

  const fields = [
    {
      label: 'Nome',
      value: permission?.label || '-',
    },
    {
      label: 'Código identificador',
      value: permission?.code || '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !permission ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !permission
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () =>
                router.push(`/permissions/${permission.id}/details`),
            }
      }
      content={
        !permission ? (
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
