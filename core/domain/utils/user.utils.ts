/**
 * Checks if an email belongs to a protected/immutable system user.
 * @param email Email to be verified.
 * @param immutableEmail Administrative email defined in system settings.
 */
export function isImmutableEmail(
  email: string,
  immutableEmail: string | undefined
): boolean {
  return email === immutableEmail;
}
