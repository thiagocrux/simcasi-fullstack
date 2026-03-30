'use client';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

import { User } from '@/core/domain/entities/user.entity';
import { useRole } from '@/hooks/useRole';
import { applyMask } from '@/lib/formatters.utils';
import { AppDialog } from '../../common/AppDialog';
import { NotFoundPreviewContent } from '../audit-logs/NotFoundPreviewContent';
import { PreviewDialogContent } from '../audit-logs/PreviewDialogContent';

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
      label: 'CPF',
      value: user?.cpf ? applyMask(user.cpf, 'cpf') : '-',
    },
    {
      label: 'Telefone',
      value: user?.phone ? applyMask(user.phone, 'phone') : '-',
    },
    {
      label: 'Matrícula',
      value: user?.enrollmentNumber || '-',
    },
    {
      label: 'Registro profissional',
      value: user?.professionalRegistration || '-',
    },
    {
      label: 'Local de trabalho',
      value: user?.workplace || '-',
    },
    {
      label: 'Nível de permissão',
      value: user?.roleId ? getRoleLabel(user.roleId) : '-',
    },
  ];

  return (
    <AppDialog
      title={title}
      description={description}
      cancelAction={{
        label: !user ? 'Fechar' : 'Cancelar',
        action: () => {},
      }}
      continueAction={
        !user
          ? undefined
          : {
              label: 'Acessar o perfil completo',
              action: () => router.push(`/users/${user.id}/details`),
            }
      }
      content={
        !user ? (
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
