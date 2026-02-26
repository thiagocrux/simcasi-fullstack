/**
 * Public environment variables exposed to the client.
 * Only variables prefixed with NEXT_PUBLIC_ are included.
 */
export const publicEnv = {
  NEXT_PUBLIC_APP_URL:
    process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',
  NEXT_PUBLIC_DEFAULT_USER_EMAIL: process.env.NEXT_PUBLIC_DEFAULT_USER_EMAIL,
};
