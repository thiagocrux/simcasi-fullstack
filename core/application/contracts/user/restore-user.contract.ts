import { User } from '@/core/domain/entities/user.entity';

export interface RestoreUserInput {
  id: string;
  restoredBy?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface RestoreUserOutput extends Omit<User, 'password'> {}
