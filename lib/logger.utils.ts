import { SYSTEM_CONSTANTS } from '@/core/domain/constants/system.constants';
import { consola } from 'consola';

/**
 * Standard log levels:
 * 0: Fatal & Error
 * 1: Warnings
 * 2: Informational messages
 * 3: Debug messages
 * 4: Trace messages
 * 5: All logs
 */
const isProduction = process.env.NODE_ENV === 'production';

export const logger = consola.create({
  level: isProduction ? 1 : 4,
  defaults: {
    tag: SYSTEM_CONSTANTS.ACRONYM,
  },
});
