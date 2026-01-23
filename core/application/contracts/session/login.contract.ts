import { AuditMetadata } from '../common/audit-metadata.contract';
import { SessionOutput } from './session-output.contract';

export interface LoginInput extends AuditMetadata {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginOutput extends SessionOutput {}
