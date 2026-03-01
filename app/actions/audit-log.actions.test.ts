/* eslint-disable @typescript-eslint/no-explicit-any */
import { findAuditLogs, getAuditLog } from './audit-log.actions';

jest.mock('@/core/infrastructure/factories/audit-log.factory');
jest.mock('@/lib/actions.utils', () => ({
  withSecuredActionAndAutomaticRetry: (_permissions: any, callback: any) =>
    callback().then((result: any) => ({ success: true, data: result })),
}));

import * as auditLogFactory from '@/core/infrastructure/factories/audit-log.factory';
const { makeFindAuditLogsUseCase, makeGetAuditLogByIdUseCase } =
  auditLogFactory as any;

describe('Audit Log Actions', () => {
  const VALID_UUID = '550e8400-e29b-41d4-a716-446655440000';

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAuditLogs', () => {
    it('should execute find use case with parsed query', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindAuditLogsUseCase.mockReturnValue(mockUseCase);

      const result = await findAuditLogs({ skip: 0, take: 10 });

      expect(makeFindAuditLogsUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 0,
          take: 10,
        })
      );
      expect(result).toEqual({
        success: true,
        data: {
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        },
      });
    });

    it('should use default values when query is empty', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          items: [],
          total: 0,
          skip: 0,
          take: 10,
        }),
      };
      makeFindAuditLogsUseCase.mockReturnValue(mockUseCase);

      await findAuditLogs();

      expect(mockUseCase.execute).toHaveBeenCalledWith({});
    });

    it('should propagate errors from use case', async () => {
      const error = new Error('Database error');
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(error),
      };
      makeFindAuditLogsUseCase.mockReturnValue(mockUseCase);

      await expect(findAuditLogs()).rejects.toThrow('Database error');
    });
  });

  describe('getAuditLog', () => {
    it('should retrieve audit log with valid UUID', async () => {
      const mockUseCase = {
        execute: jest.fn().mockResolvedValue({
          id: VALID_UUID,
          userId: VALID_UUID,
          action: 'create',
          entityName: 'User',
          entityId: VALID_UUID,
        }),
      };
      makeGetAuditLogByIdUseCase.mockReturnValue(mockUseCase);

      const result = await getAuditLog(VALID_UUID);

      expect(makeGetAuditLogByIdUseCase).toHaveBeenCalled();
      expect(mockUseCase.execute).toHaveBeenCalledWith({ id: VALID_UUID });
      expect(result).toBeDefined();
    });

    it('should throw ValidationError for invalid UUID', async () => {
      await expect(getAuditLog('invalid-uuid')).rejects.toThrow();
    });

    it('should propagate errors from use case', async () => {
      const error = new Error('Not found');
      const mockUseCase = {
        execute: jest.fn().mockRejectedValue(error),
      };
      makeGetAuditLogByIdUseCase.mockReturnValue(mockUseCase);

      await expect(getAuditLog(VALID_UUID)).rejects.toThrow();
    });
  });
});
