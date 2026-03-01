/* eslint-disable @typescript-eslint/no-explicit-any */
jest.mock('@/core/infrastructure/lib/request-context', () => ({
  getRequestContext: jest.fn(() => ({
    userId: 'ctx-user-id',
    roleId: 'ctx-role-id',
    roleCode: 'admin',
    ipAddress: '127.0.0.1',
    userAgent: 'Jest',
  })),
}));

jest.mock('@/core/application/validation/schemas/exam.schema', () => ({
  examSchema: {
    safeParse: jest.fn((data: any) => ({ success: true, data })),
    partial: jest.fn(() => ({
      safeParse: jest.fn((data: any) => ({ success: true, data })),
    })),
  },
}));

jest.mock('@/core/application/validation/zod.utils', () => ({
  formatZodError: jest.fn(() => ({ field: ['error'] })),
}));

import { NotFoundError, ValidationError } from '@/core/domain/errors/app.error';
import { RegisterExamUseCase } from './register-exam.use-case';

const mockExamRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  update: jest.fn(),
  softDelete: jest.fn(),
  restore: jest.fn(),
};

const mockPatientRepository = {
  findById: jest.fn(),
};

const mockAuditLogRepository = {
  create: jest.fn(),
};

describe('RegisterExamUseCase', () => {
  let useCase: RegisterExamUseCase;

  const validInput = {
    patientId: 'patient-1',
    treponemalTestType: 'Rapid',
    treponemalTestResult: 'Positive',
    treponemalTestDate: '2025-01-01',
    treponemalTestLocation: 'Lab A',
    nontreponemalVdrlTest: 'Reactive',
    nontreponemalTestTitration: '1:8',
    nontreponemalTestDate: '2025-01-02',
    referenceObservations: 'Some observations',
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCase = new RegisterExamUseCase(
      mockExamRepository as any,
      mockPatientRepository as any,
      mockAuditLogRepository as any
    );
  });

  it('should create an exam and audit log on success', async () => {
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce({ id: 'patient-1' });
    const createdExam = { id: 'exam-1', ...validInput };
    mockExamRepository.create.mockResolvedValueOnce(createdExam);

    const result = await useCase.execute(validInput);

    expect(mockPatientRepository.findById).toHaveBeenCalledWith('patient-1');
    expect(mockExamRepository.create).toHaveBeenCalled();
    expect(mockAuditLogRepository.create).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        entityName: 'EXAM',
        entityId: 'exam-1',
      })
    );
    expect(result).toEqual(createdExam);
  });

  it('should throw ValidationError when input is invalid', async () => {
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.safeParse.mockReturnValueOnce({
      success: false,
      error: { issues: [] },
    });

    await expect(useCase.execute({} as any)).rejects.toThrow(ValidationError);
  });

  it('should throw NotFoundError when patient does not exist', async () => {
    const {
      examSchema,
    } = require('@/core/application/validation/schemas/exam.schema');
    examSchema.safeParse.mockReturnValueOnce({
      success: true,
      data: validInput,
    });
    mockPatientRepository.findById.mockResolvedValueOnce(null);

    await expect(useCase.execute(validInput)).rejects.toThrow(NotFoundError);
  });
});
