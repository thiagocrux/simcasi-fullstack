/* eslint-disable @typescript-eslint/no-explicit-any */
import * as z from 'zod';

/**
 * Standardized way to flatten Zod errors using the Zod 4 treeifyError function.
 * This ensures compatibility with the latest Zod standards while maintaining
 * the Record<string, string[]> format for the UI.
 *
 * @param error - The ZodError to flatten.
 * @returns A flattened Record of field errors.
 */
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const tree = (z as any).treeifyError(error);
  const fieldErrors: Record<string, string[]> = {};

  if (tree.properties) {
    for (const [key, value] of Object.entries(tree.properties)) {
      if (value && typeof value === 'object' && 'errors' in value) {
        fieldErrors[key] = (value as any).errors;
      }
    }
  }

  return fieldErrors;
}
