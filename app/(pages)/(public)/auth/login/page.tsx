import { Metadata } from 'next';

import { LockSection } from '@/app/components/features/auth/LockSection';
import { LoginForm } from '@/app/components/features/auth/LoginForm';
import { Card } from '@/app/components/ui/card';
import { Separator } from '@/app/components/ui/separator';

export const metadata: Metadata = {
  title: 'Página de acesso | SIMCASI',
  description: '',
};

export default function LoginPage() {
  return (
    <Card className="flex md:flex-row flex-col items-stretch gap-0 my-auto p-0 w-full max-w-md md:max-w-4xl">
      <div className="flex flex-col gap-y-6 p-6 md:p-12 w-full">
        <div className="flex flex-col gap-y-2">
          <p className="font-bold text-2xl">Bem-vindo(a) de volta</p>
          <p className="text-gray-500 text-sm">
            Insira suas credenciais para acessar.
          </p>
        </div>
        <LoginForm />
      </div>
      <Separator orientation="vertical" className="hidden md:flex gap-0" />
      <LockSection className="p-6 md:p-12" />
    </Card>
  );
}
