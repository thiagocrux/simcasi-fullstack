import { NotFoundError } from '@/core/domain/errors/app.error';
import { SessionRepository } from '@/core/domain/repositories/session.repository';
import {
  GetSessionByIdInput,
  GetSessionByIdOutput,
} from '../../contracts/session/get-session-by-id.contract';
import { UseCase } from '../use-case.interface';

/**
 * Use case to retrieve a session by ID.
 * Standardizes the "get by ID" logic for session monitoring.
 */
export class GetSessionByIdUseCase implements UseCase<
  GetSessionByIdInput,
  GetSessionByIdOutput
> {
  /**
   * Creates an instance of GetSessionByIdUseCase.
   * @param sessionRepository The repository for session data operations.
   */
  constructor(private readonly sessionRepository: SessionRepository) {}

  /**
   * Executes the use case to retrieve a session by ID.
   * @param input The session ID and options.
   * @return A promise that resolves to the session details.
   * @throws {NotFoundError} If the session is not found.
   */
  async execute(input: GetSessionByIdInput): Promise<GetSessionByIdOutput> {
    const session = await this.sessionRepository.findById(
      input.id,
      input.includeDeleted
    );

    if (!session) {
      throw new NotFoundError('Sessão');
    }

    return session;
  }
}
