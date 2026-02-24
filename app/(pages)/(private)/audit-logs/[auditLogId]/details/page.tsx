import { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { getAuditLog } from '@/app/actions/audit-log.actions';
import { DetailsPageProperties } from '@/app/components/common/DetailsPageProperties';
import { PageHeader } from '@/app/components/common/PageHeader';
import { ReturnLink } from '@/app/components/common/ReturnLink';
import {
  ACTION_LABELS,
  ENTITY_LABELS,
} from '@/core/domain/constants/audit-log.constants';
import { formatDate } from '@/lib/formatters.utils';

type AuditLogDetailsPageProps = { params: Promise<{ auditLogId: string }> };

export async function generateMetadata({
  params,
}: AuditLogDetailsPageProps): Promise<Metadata> {
  const { auditLogId } = await params;
  return {
    title: `Detalhes do log ${auditLogId.slice(0, 8)} | SIMCASI`,
    description:
      'Consulte as informações detalhadas deste log de auditoria no SIMCASI.',
  };
}

export default async function AuditLogDetailsPage({
  params,
}: AuditLogDetailsPageProps) {
  const { auditLogId } = await params;
  const response = await getAuditLog(auditLogId);

  if (!response.success || !response.data) {
    return notFound();
  }

  const log = response.data;

  const data = [
    {
      title: 'Informações Gerais',
      fields: [
        {
          label: 'Ação',
          value: ACTION_LABELS[log.action] || log.action,
        },
        {
          label: 'Entidade afetada',
          value: ENTITY_LABELS[log.entityName] || log.entityName,
        },
        { label: 'ID do registro afetado', value: log.entityId },
      ],
    },
    {
      title: 'Metadados',
      fields: [
        { label: 'ID', value: log.id },
        { label: 'Autor', value: log.userId },
        { label: 'Endereço IP', value: log.ipAddress || 'Não registrado' },
        { label: 'User agent', value: log.userAgent || 'Não registrado' },
        { label: 'Criado em', value: formatDate(log.createdAt) },
      ],
    },
  ];

  const jsonFields = [
    {
      label: 'Valores antigos',
      value: log.oldValues
        ? JSON.stringify(log.oldValues, null, 2)
        : 'Nenhum dado anterior registrado.',
    },
    {
      label: 'Novos valores',
      value: log.newValues
        ? JSON.stringify(log.newValues, null, 2)
        : 'Nenhum novo dado registrado.',
    },
  ];

  return (
    <div className="flex flex-col gap-8 w-full max-w-4xl">
      <div className="flex flex-col gap-4">
        <ReturnLink />
        <PageHeader
          title="Detalhes do log de auditoria"
          description="Aqui você pode visualizar todas as informações deste log de auditoria, incluindo dados de autoria, ação performada e metadados."
        />
      </div>

      <DetailsPageProperties data={data} />

      <div className="gap-6 grid grid-cols-1 md:grid-cols-2">
        {jsonFields.map((field) => (
          <div key={field.label} className="flex flex-col gap-4">
            <h3 className="font-semibold text-lg">{field.label}</h3>
            <div className="bg-muted p-4 rounded-lg max-h-[400px] overflow-auto">
              <pre className="font-mono text-xs break-all leading-relaxed whitespace-pre-wrap">
                {field.value}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
