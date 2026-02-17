import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { SettingsDetails } from '@/app/components/common/SettingsDetails';

export const metadata: Metadata = {
  title: 'Configurações | SIMCASI',
  description:
    'Gerencie suas preferências de conta, configurações de segurança e parâmetros de notificação. Personalize como o SIMCASI deve se comportar para otimizar seu fluxo de trabalho clínico e garantir a conformidade com os protocolos da instituição.',
};

export default async function UsersPage() {
  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <ReturnLink />
      <PageHeader
        title="Configurações"
        description="Gerencie suas preferências de conta, configurações de segurança e parâmetros de notificação. Personalize como o SIMCASI deve se comportar para otimizar seu fluxo de trabalho clínico e garantir a conformidade com os protocolos da instituição."
      />
      <SettingsDetails />
    </div>
  );
}
