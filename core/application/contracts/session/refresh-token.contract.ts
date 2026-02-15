import { SessionOutput } from './session-output.contract';

export interface RefreshTokenInput {
  refreshToken: string;
}

export interface RefreshTokenOutput extends SessionOutput {}
