'use client';

import { useUser } from '@/hooks/useUser';
import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Separator } from '../ui/separator';

export function SettingsDetails() {
  const router = useRouter();
  const { user } = useUser();

  return (
    <Card className="flex flex-col items-start gap-8 px-8 py-6 text-sm">
      <div className="flex flex-col w-full">
        <p className="font-medium text-lg">Conta</p>
        <Separator className="" />
        <Button
          variant="link"
          className="px-0 w-min cursor-pointer"
          onClick={() => router.push(`/users/${user?.id}/change-password`)}
        >
          Atualizar senha
        </Button>
      </div>
    </Card>
  );
}
