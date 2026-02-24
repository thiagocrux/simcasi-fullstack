'use client';

import { useQuery } from '@tanstack/react-query';
import { ReactNode } from 'react';

import { getExam } from '@/app/actions/exam.actions';
import { getNotification } from '@/app/actions/notification.actions';
import { getObservation } from '@/app/actions/observation.actions';
import { getPatient } from '@/app/actions/patient.actions';
import { getPermission } from '@/app/actions/permission.actions';
import { getRole } from '@/app/actions/role.actions';
import { getSession } from '@/app/actions/session.actions';
import { getTreatment } from '@/app/actions/treatment.actions';
import { getUser } from '@/app/actions/user.actions';
import { EntityName } from '@/core/domain/entities/audit-log.entity';
import { logger } from '@/lib/logger.utils';
import { ExamPreviewDialog } from '../exams/ExamPreviewDialog';
import { NotificationPreviewDialog } from '../notifications/NotificationPreviewDialog';
import { ObservationPreviewDialog } from '../observations/ObservationPreviewDialog';
import { PatientPreviewDialog } from '../patients/PatientPreviewDialog';
import { PermissionPreviewDialog } from '../permissions/PermissionPreviewDialog';
import { RolePreviewDialog } from '../roles/RolePreviewDialog';
import { SessionPreviewDialog } from '../sessions/SessionPreviewDialog';
import { TreatmentPreviewDialog } from '../treatments/TreatmentPreviewDialog';
import { UserPreviewDialog } from '../users/UserPreviewDialog';

interface EntityPreviewWrapperProps {
  entityId: string;
  entityName: EntityName;
  children: ReactNode;
}

const PREVIEW_CONFIG: Record<
  EntityName,
  { title: string; description: string }
> = {
  PATIENT: {
    title: 'Detalhes do paciente',
    description: 'Informações básicas sobre o paciente auditado.',
  },
  EXAM: {
    title: 'Detalhes do exame',
    description: 'Informações básicas sobre o exame auditado.',
  },
  TREATMENT: {
    title: 'Detalhes do tratamento',
    description: 'Informações básicas sobre o tratamento auditado.',
  },
  NOTIFICATION: {
    title: 'Detalhes da notificação',
    description: 'Informações básicas sobre a notificação auditada.',
  },
  OBSERVATION: {
    title: 'Detalhes da observação',
    description: 'Informações básicas sobre a observação auditada.',
  },
  USER: {
    title: 'Detalhes do usuário',
    description: 'Informações sobre o usuário auditado.',
  },
  ROLE: {
    title: 'Detalhes do cargo',
    description: 'Informações sobre o cargo auditado.',
  },
  PERMISSION: {
    title: 'Detalhes da permissão',
    description: 'Informações sobre a permissão auditada.',
  },
  SESSION: {
    title: 'Detalhes da sessão',
    description: 'Informações sobre a sessão auditada.',
  },
};

export function EntityPreviewWrapper({
  entityId,
  entityName,
  children,
}: EntityPreviewWrapperProps) {
  logger.info('Rendering previews.', {
    action: 'audit_entity_preview',
    details: { entityName, entityId },
  });

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['get-entity-preview', entityName, entityId],
    queryFn: async () => {
      try {
        let result;
        switch (entityName) {
          case 'PATIENT':
            result = await getPatient(entityId);
            break;
          case 'EXAM':
            result = await getExam(entityId);
            break;
          case 'TREATMENT':
            result = await getTreatment(entityId);
            break;
          case 'NOTIFICATION':
            result = await getNotification(entityId);
            logger.info('Notification response received.', {
              action: 'audit_entity_preview',
              result,
            });
            break;
          case 'OBSERVATION':
            result = await getObservation(entityId);
            break;
          case 'USER':
            result = await getUser(entityId);
            break;
          case 'ROLE':
            result = await getRole(entityId);
            break;
          case 'PERMISSION':
            result = await getPermission(entityId);
            break;
          case 'SESSION':
            result = await getSession(entityId);
            break;
          default:
            logger.warn({
              action: 'audit_entity_preview',
              cause: 'Unknown entity type.',
              entityName,
            });
            return null;
        }
        return result;
      } catch (err) {
        logger.error({
          action: 'audit_entity_preview',
          cause: `Error fetching ${entityName} preview catalog.`,
          error: err,
        });
        throw err;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });

  logger.info('Query state updated.', {
    action: 'audit_entity_preview',
    details: {
      isLoading,
      hasError: !!error,
      hasResponse: !!response,
      success: (response as Record<string, unknown>)?.success,
    },
  });

  if (isLoading) {
    logger.info(`Loading ${entityName} data...`, {
      action: 'audit_entity_preview',
      entityId,
    });
    return children;
  }

  if (error) {
    logger.error({
      action: 'audit_entity_preview',
      cause: `Error loading ${entityName} data.`,
      error,
      entityId,
    });
    // Not found error - render with undefined data to show "not found" message
    if ((response as Record<string, unknown>)?.code === 'NotFoundError') {
      const config = PREVIEW_CONFIG[entityName];
      return renderPreviewDialog(
        entityName,
        undefined,
        children,
        config.title,
        config.description
      );
    }
    return children;
  }

  if (!(response as Record<string, unknown>)?.success) {
    logger.warn({
      action: 'audit_entity_preview',
      cause: `Query failed for ${entityName}.`,
      response,
      entityId,
    });
    // Render dialog with undefined to show error message
    const config = PREVIEW_CONFIG[entityName];
    return renderPreviewDialog(
      entityName,
      undefined,
      children,
      config.title,
      config.description
    );
  }

  if (!(response as Record<string, unknown>)?.data) {
    logger.warn({
      action: 'audit_entity_preview',
      cause: `No data returned for ${entityName}.`,
      entityId,
    });
    // Render dialog with undefined to show error message
    const config = PREVIEW_CONFIG[entityName];
    return renderPreviewDialog(
      entityName,
      undefined,
      children,
      config.title,
      config.description
    );
  }

  const entityData = (response as Record<string, unknown>).data;

  logger.info(`Rendering ${entityName} preview dialog.`, {
    action: 'audit_entity_preview',
  });

  const config = PREVIEW_CONFIG[entityName];
  return renderPreviewDialog(
    entityName,
    entityData,
    children,
    config.title,
    config.description
  );
}

function renderPreviewDialog(
  entityName: EntityName,
  entityData: unknown,
  children: ReactNode,
  title: string,
  description: string
) {
  switch (entityName) {
    case 'PATIENT':
      return (
        <PatientPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          patient={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </PatientPreviewDialog>
      );
    case 'EXAM':
      return (
        <ExamPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          exam={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </ExamPreviewDialog>
      );
    case 'TREATMENT':
      return (
        <TreatmentPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          treatment={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </TreatmentPreviewDialog>
      );
    case 'NOTIFICATION':
      logger.info(
        '[ENTITY_PREVIEW_WRAPPER] Creating NotificationPreviewDialog'
      );
      return (
        <NotificationPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          notification={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </NotificationPreviewDialog>
      );
    case 'OBSERVATION':
      return (
        <ObservationPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          observation={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </ObservationPreviewDialog>
      );
    case 'USER':
      return (
        <UserPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          user={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </UserPreviewDialog>
      );
    case 'ROLE':
      return (
        <RolePreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          role={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </RolePreviewDialog>
      );
    case 'PERMISSION':
      return (
        <PermissionPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          permission={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </PermissionPreviewDialog>
      );
    case 'SESSION':
      return (
        <SessionPreviewDialog
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          session={entityData as any}
          title={title}
          description={description}
        >
          {children}
        </SessionPreviewDialog>
      );
    default:
      return children;
  }
}
