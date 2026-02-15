import { User } from '@/core/domain/entities/user.entity';

export interface RegisterUserInput {
  name: string;
  email: string;
  password: string;
  roleId: string;
}

export interface RegisterUserOutput extends Omit<User, 'password'> {}
