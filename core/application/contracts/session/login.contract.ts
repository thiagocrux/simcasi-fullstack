import { SessionOutput } from './session-output.contract';

/** Input parameters for user login. */
export interface LoginInput {
  /** User's email address. */
  email: string;
  /** User's plain-text password. */
  password: string;
  /** Whether to issue a long-lived refresh token. */
  rememberMe?: boolean;
}

/** Output of the login operation. */
export interface LoginOutput extends SessionOutput {}
