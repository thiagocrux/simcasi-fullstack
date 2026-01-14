import { SessionOutput } from './session-output.contract';

export interface RefreshTokenInput {
  refreshToken: string;
  ipAddress: string;
  userAgent: string;
}

export interface RefreshTokenOutput extends SessionOutput {}
