import { SessionRepository } from '@/core/domain/repositories/session.repository';
import {
  LogoutInput,
  LogoutOutput,
} from '../../contracts/session/logout.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to terminate a session (Logout).
 */
export class LogoutUseCase implements UseCase<LogoutInput, LogoutOutput> {
  constructor(private readonly sessionRepository: SessionRepository) {}

  async execute(input: LogoutInput): Promise<LogoutOutput> {
    await this.sessionRepository.softDelete(input.sessionId);
  }
}
