'use client';

import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { History } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

import { findAuditLogs } from '@/app/actions/audit-log.actions';
import { FindAuditLogsOutput } from '@/core/application/contracts/audit-log/find-audit-logs.contract';
import { AUDIT_LOG_ACTIONS } from '@/core/domain/constants/audit-log.constants';
import { ActionResponse } from '@/lib/actions.utils';
import { formatDate } from '@/lib/formatters.utils';
import { logger } from '@/lib/logger.utils';
import { getTimezoneOffset } from '@/lib/shared.utils';
import { CustomSkeleton } from '../../common/CustomSkeleton';
import { Button } from '../../ui/button';
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '../../ui/item';

interface LatestActionsPerformed {
  maxListSize?: number;
}

export function LatestActionsPerformed({
  maxListSize = 5,
}: LatestActionsPerformed) {
  const router = useRouter();

  // Avoid hydration mismatch by only rendering after mount.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const {
    data: auditLogList,
    isPending: isAuditLogListPending,
    error: auditLogListError,
  } = useQuery({
    queryKey: ['find-audit-logs', 'dashboard'],
    queryFn: async () => {
      if (!mounted) {
        return {
          success: true,
          data: { items: [], total: 0 },
        } as ActionResponse<FindAuditLogsOutput>;
      }

      return await findAuditLogs({
        skip: 0,
        take: maxListSize,
        timezoneOffset: getTimezoneOffset(),
        includeRelatedUsers: true,
        includeDeleted: false,
      });
    },
    enabled: mounted,
    placeholderData: keepPreviousData,
  });

  const auditLogs = useMemo(() => {
    if (auditLogList?.success) {
      return auditLogList.data.items;
    }
    if (auditLogList && !auditLogList.success) {
      logger.error('Failed to fetch audit logs', {
        cause: 'An error occurred while fetching audit logs from the API.',
        error: auditLogListError,
        action: 'fetch_audit_logs',
      });
    }
    return [];
  }, [auditLogList, auditLogListError]);

  function generateMessage(
    userId: string,
    action: (typeof AUDIT_LOG_ACTIONS)[number],
    entity: string
  ) {
    const foundUser =
      auditLogList?.success &&
      auditLogList.data.relatedUsers?.filter((user) => user.id === userId)[0];

    const ACTIONS: Record<(typeof AUDIT_LOG_ACTIONS)[number], string> = {
      CREATE: 'criou',
      UPDATE: 'atualizou',
      DELETE: 'excluiu',
      RESTORE: 'restaurou',
      REVOKE_SESSION: 'revogou',
      PASSWORD_CHANGE: 'atualizou a senha de',
      PASSWORD_RESET: 'redefiniu a senha de',
      PASSWORD_RESET_REQUEST: 'solicitou a redefinição de senha de',
    };

    const ENTITIES: Record<string, string> = {
      EXAM: 'um exame',
      NOTIFICATION: 'uma notificação',
      SESSION: 'uma sessão',
      TREATMENT: 'um tratamento',
      PERMISSION: 'uma permissão',
      PATIENT: 'um paciente',
      USER: 'um usuário',
      OBSERVATION: 'uma observação',
      ROLE: 'um cargo',
      AUDIT_LOG: 'um log de auditoria',
    };

    if (!foundUser || !action || !entity) {
      return;
    }

    return `O usuário ${foundUser.name} ${ACTIONS[action]} ${ENTITIES[entity]}.`;
  }

  if (isAuditLogListPending) {
    return <CustomSkeleton variant="record-list" />;
  }

  if (auditLogs.length <= 0) {
    return (
      <div className="flex flex-col justify-center items-center mx-auto py-4 max-w-80 text-center">
        <Image
          src="/icons/nothing-here.svg"
          width={150}
          height={150}
          alt="Sem atividades"
        />
        <div className="flex flex-col gap-2 mt-2">
          <p className="font-bold text-xl">Nenhuma ação realizada</p>
          <p className="text-muted-foreground">
            Ainda não há registros de atividades no sistema. As ações executadas
            pelos usuários aparecerão aqui.
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      {auditLogs.map((auditLog) => (
        <Item key={auditLog.id} variant="muted">
          <ItemMedia variant="icon">
            <History />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>
              {generateMessage(
                auditLog.userId,
                auditLog.action,
                auditLog.entityName
              )}
            </ItemTitle>
            <ItemDescription>{formatDate(auditLog.createdAt)}</ItemDescription>
          </ItemContent>
        </Item>
      ))}
      <Button
        variant="outline"
        className="self-center cursor-pointer select-none"
        onClick={() => router.push('/audit-logs')}
      >
        <History />
        Ver todos os logs
      </Button>
    </>
  );
}
