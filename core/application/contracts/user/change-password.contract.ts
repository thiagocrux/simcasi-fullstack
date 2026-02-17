import { User } from '@/core/domain/entities/user.entity';

export interface ChangePasswordInput {
  userId: string;
  currentPassword: string;
  newPassword: string;
}

export interface ChangePasswordOutput extends Omit<User, 'password'> {}
