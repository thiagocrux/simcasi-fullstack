import 'dotenv/config';

import { ConfigurationError } from '@/core/domain/errors/app.error';
import { logger } from '@/lib/logger.utils';

/**
 * Required environment variables that must be defined.
 */
const REQUIRED_ENV_VARS = ['DATABASE_URL', 'JWT_SECRET'] as const;

/**
 * Validated application environment variables.
 */
export const env = {
  // Global Environment
  NODE_ENV:
    (process.env.NODE_ENV as 'development' | 'production' | 'test') ??
    'development',

  // -- APPLICATION --
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  NEXT_PUBLIC_DEFAULT_USER_EMAIL: process.env.NEXT_PUBLIC_DEFAULT_USER_EMAIL,
  DEFAULT_USER_PASSWORD: process.env.DEFAULT_USER_PASSWORD,

  // -- DOCKER --
  POSTGRES_DATABASE: process.env.POSTGRES_DATABASE,
  POSTGRES_USER: process.env.POSTGRES_USER,
  POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
  POSTGRES_HOST: process.env.POSTGRES_HOST,
  POSTGRES_HOST_PORT: process.env.POSTGRES_HOST_PORT
    ? parseInt(process.env.POSTGRES_HOST_PORT, 10)
    : undefined,
  POSTGRES_CONTAINER_PORT: process.env.POSTGRES_CONTAINER_PORT
    ? parseInt(process.env.POSTGRES_CONTAINER_PORT, 10)
    : undefined,

  // -- PRISMA --
  DATABASE_URL: process.env.DATABASE_URL ?? '',

  // -- SECURITY --
  JWT_SECRET: process.env.JWT_SECRET ?? '',
  JWT_ACCESS_TOKEN_EXPIRATION: process.env.JWT_ACCESS_TOKEN_EXPIRATION ?? '15m',
  JWT_REFRESH_TOKEN_EXPIRATION:
    process.env.JWT_REFRESH_TOKEN_EXPIRATION ?? '7d',

  // -- MESSAGING (RESEND) --
  RESEND_API_KEY: process.env.RESEND_API_KEY,
  MAIL_FROM: process.env.MAIL_FROM,
};

/**
 * Validate required environment variables.
 */
const missingVars = REQUIRED_ENV_VARS.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
  const missingList = missingVars.join(', ');

  logger.error('Required environment variables are missing.', {
    missing: missingVars,
    action: 'env_validation',
  });

  throw new ConfigurationError(
    `Variáveis de ambiente obrigatórias não definidas: ${missingList}`
  );
}
