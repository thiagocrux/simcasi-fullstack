import { SessionOutput } from './session-output.contract';

export interface LoginInput {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginOutput extends SessionOutput {}
