/* eslint-disable @typescript-eslint/no-explicit-any */
const mockExecute = jest.fn();

jest.mock('../factories/audit-log.factory', () => ({
  makeRegisterAuditLogUseCase: () => ({ execute: mockExecute }),
}));

import { auditAction } from './audit.middleware';

describe('auditAction', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delegate to RegisterAuditLogUseCase and return its output', async () => {
    const input = {
      userId: 'user-1',
      action: 'CREATE',
      target: 'Patient',
      targetId: 'patient-1',
      metadata: { name: 'John' },
    };
    const expectedOutput = { id: 'log-1', ...input, createdAt: new Date() };
    mockExecute.mockResolvedValueOnce(expectedOutput);

    const result = await auditAction(input as any);

    expect(mockExecute).toHaveBeenCalledWith(input);
    expect(result).toEqual(expectedOutput);
  });

  it('should propagate errors from the use case', async () => {
    mockExecute.mockRejectedValueOnce(new Error('DB error'));

    await expect(auditAction({} as any)).rejects.toThrow('DB error');
  });
});
