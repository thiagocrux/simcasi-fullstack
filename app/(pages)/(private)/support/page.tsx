import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';

export const metadata: Metadata = {
  title: 'Suporte técnico | SIMCASI',
  description:
    'Central de ajuda e suporte técnico. Aqui você pode encontrar canais de contato, manuais de utilização e abrir chamados para suporte operacional. Estamos à disposição para garantir que o monitoramento dos casos ocorra sem interrupções.',
};

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-6xl">
      <ReturnLink />
      <PageHeader
        title="Suporte técnico"
        description="Central de ajuda e suporte técnico. Aqui você pode encontrar canais de contato, manuais de utilização e abrir chamados para suporte operacional. Estamos à disposição para garantir que o monitoramento dos casos ocorra sem interrupções."
      />
      {/* TODO: Implement form to send e-mail to support. Create text tutorial explaining the best way to ask for help providing evidence of what caused the problem (e.g Steps to the error, etc). */}
      <p>PLACEHOLDER</p>
    </div>
  );
}
