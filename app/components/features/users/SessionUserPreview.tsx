'use client';

import { Eye } from 'lucide-react';

import { User } from '@/core/domain/entities/user.entity';
import { Button } from '../../ui/button';
import { UserPreviewDialog } from './UserPreviewDialog';

interface SessionUserPreviewProps {
  user: Omit<User, 'password'> | null;
  label?: string;
}

export function SessionUserPreview({ user, label }: SessionUserPreviewProps) {
  if (!user) return null;

  return (
    <UserPreviewDialog
      title="Informações do usuário"
      description="Pré-visualize os detalhes e acesse o perfil completo para mais informações."
      user={user}
    >
      <Button
        variant="outline"
        size="sm"
        className="w-fit cursor-pointer select-none"
      >
        <Eye />
        {label || user.name}
      </Button>
    </UserPreviewDialog>
  );
}
