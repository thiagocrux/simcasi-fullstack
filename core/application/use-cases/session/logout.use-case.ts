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
  /**
   * Initializes a new instance of the LogoutUseCase class.
   *
   * @param sessionRepository The repository for session persistence.
   */
  constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Executes the use case to terminate a session.
   *
   * @param input The data containing the session ID to logout.
   * @return A promise that resolves when the session is revoked.
   */
  async execute(input: LogoutInput): Promise<LogoutOutput> {
    await this.sessionRepository.softDelete(input.sessionId);
  }
}
