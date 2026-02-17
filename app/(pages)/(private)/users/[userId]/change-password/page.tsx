import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { PasswordChangeForm } from '@/app/components/features/auth/PasswordChangeForm';

export const metadata: Metadata = {
  title: 'Atualização de senha | SIMCASI',
  description: 'Atualize a senha do usuário logado ao sistema no SIMCASI.',
};

interface UpdatePasswordPageProps {
  params: Promise<{ userId: string }>;
}

export default async function UpdatePasswordPage({
  params,
}: UpdatePasswordPageProps) {
  const { userId } = await params;

  return (
    <>
      <div className="flex flex-col gap-8 w-full max-w-3xl">
        <ReturnLink />
        <PageHeader
          title="Atualização de senha"
          description="Atualize a senha do usuário logado ao sistema no SIMCASI."
        />
        <PasswordChangeForm />
      </div>
    </>
  );
}
