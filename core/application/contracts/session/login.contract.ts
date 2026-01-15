import { SessionOutput } from './session-output.contract';

export interface LoginInput {
  email: string;
  password: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface LoginOutput extends SessionOutput {}
