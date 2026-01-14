import { User } from '@/core/domain/entities/user.entity';

export interface RestoreUserInput {
  id: string;
}

export interface RestoreUserOutput extends Omit<User, 'password'> {}
