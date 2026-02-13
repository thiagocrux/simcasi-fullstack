import { AsyncLocalStorage } from 'node:async_hooks';

/**
 * Metadata associated with a request for auditing and security purposes.
 */
export interface RequestContext {
  /** The ID of the user performing the request */
  userId: string;
  /** The ID of the role of the user */
  roleId: string;
  /** The programmatic code of the role (e.g., 'admin', 'user') */
  roleCode: string;
  /** Client's IP address */
  ipAddress: string;
  /** Client's User Agent string */
  userAgent: string;
}

/**
 * AsyncLocalStorage instance for managing request-scoped metadata.
 * Allows retrieving context information without prop-drilling through Use Cases.
 */
export const requestContextStore = new AsyncLocalStorage<RequestContext>();

/**
 * Retrieves the current request context.
 * Throws an error if accessed outside of a valid request scope.
 *
 * @returns The current RequestContext
 * @throws Error if context is not found
 */
export function getRequestContext(): RequestContext {
  const context = requestContextStore.getStore();

  if (!context) {
    throw new Error(
      '[RequestContext] Attempted to access context outside of a valid request scope. Check if the entry point (Server Action or API Route) is properly wrapped.'
    );
  }

  return context;
}

/**
 * Helper to check if the current user is an Administrator based on context.
 *
 * @returns boolean
 */
export function isUserAdmin(): boolean {
  try {
    const context = getRequestContext();
    return context.roleCode === 'admin';
  } catch {
    return false;
  }
}
