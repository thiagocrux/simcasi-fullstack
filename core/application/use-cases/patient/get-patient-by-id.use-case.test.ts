/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundError } from '@/core/domain/errors/app.error';
import { GetPatientByIdUseCase } from './get-patient-by-id.use-case';

const mockPatientRepository = { findById: jest.fn() };

describe('GetPatientByIdUseCase', () => {
  let useCase: GetPatientByIdUseCase;

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new GetPatientByIdUseCase(mockPatientRepository as any);
  });

  it('should return the patient when found', async () => {
    const patient = { id: 'p1', name: 'John' };
    mockPatientRepository.findById.mockResolvedValueOnce(patient);
    expect(await useCase.execute({ id: 'p1' })).toEqual(patient);
  });

  it('should throw NotFoundError when not found', async () => {
    mockPatientRepository.findById.mockResolvedValueOnce(null);
    await expect(useCase.execute({ id: 'x' })).rejects.toThrow(NotFoundError);
  });
});
