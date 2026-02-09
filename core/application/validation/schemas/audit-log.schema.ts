import { z } from 'zod';

import {
  AUDIT_LOG_ACTIONS,
  AUDIT_LOG_ENTITY_NAMES,
  AUDIT_LOG_SEARCHABLE_FIELDS,
  AUDIT_LOG_SORTABLE_FIELDS,
} from '@/core/domain/constants/audit-log.constants';

import {
  createQuerySchema,
  UserEnrichmentFields,
  UserFilterFields,
} from './common.schema';

/**
 * Standardized query schema for listing audit logs.
 *
 * Includes standard pagination, sorting, search, and fragments for:
 * - User filtering (userId)
 * - User enrichment (includeRelatedUsers)
 * - Audit specific filters (action, entityName, entityId)
 */
export const auditLogQuerySchema = createQuerySchema(
  AUDIT_LOG_SORTABLE_FIELDS,
  AUDIT_LOG_SEARCHABLE_FIELDS
).extend({
  ...UserFilterFields,
  ...UserEnrichmentFields,
  action: z.enum(AUDIT_LOG_ACTIONS).optional(),
  entityName: z.enum(AUDIT_LOG_ENTITY_NAMES).optional(),
  entityId: z.string().optional(),
});

/**
 * Type for audit log query input.
 *
 * Includes filters, pagination, and sorting for listing audit logs.
 * Used in server actions and use cases.
 */
export type AuditLogQueryInput = Partial<z.infer<typeof auditLogQuerySchema>>;
