import { SessionOutput } from './session-output.contract';

/** Input parameters for refreshing an authentication token. */
export interface RefreshTokenInput {
  /** The valid refresh token string. */
  refreshToken: string;
}

/** Output of the refresh token operation. */
export interface RefreshTokenOutput extends SessionOutput {}
