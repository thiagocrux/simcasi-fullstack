import { Metadata } from 'next';

import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import { AuditLogPageGuard } from '@/app/components/features/audit-logs/AuditLogPageGuard';
import { AuditLogsTable } from '@/app/components/features/audit-logs/AuditLogsTable';

export const metadata: Metadata = {
  title: 'Logs de auditoria | SIMCASI',
  description:
    'Rastreie e valide todas as alterações críticas realizadas no sistema. Garanta conformidade com a LGPD através do monitoramento de acessos e modificações de dados.',
};

export default async function AuditLogsPage() {
  return (
    <AuditLogPageGuard>
      <div className="flex flex-col gap-8 w-full max-w-6xl">
        <ReturnLink />
        <PageHeader
          title="Logs de auditoria"
          description="Visualize e acompanhe o histórico de todas as operações realizadas no sistema pelos usuários para fins de segurança e conformidade."
        />
        <AuditLogsTable showIdColumn={false} />
      </div>
    </AuditLogPageGuard>
  );
}
