export interface FindSessionsInput {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
  timezoneOffset?: string;
  search?: string;
  userId?: string;
  includeDeleted?: boolean;
}

export interface FindSessionsOutput {
  items: Array<{
    id: string;
    userId: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    issuedAt: Date;
    expiresAt: Date;
    deletedAt: Date | null;
  }>;
  total: number;
}
