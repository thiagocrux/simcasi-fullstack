import { User } from '@/core/domain/entities/user.entity';

export interface UpdateUserInput {
  id: string;
  name?: string;
  email?: string;
  password?: string;
  roleId?: string;
}

export interface UpdateUserOutput extends Omit<User, 'password'> {}
