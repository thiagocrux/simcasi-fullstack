import { User } from '@/core/domain/entities/user.entity';

export interface RegisterUserInput extends Omit<
  User,
  'id' | 'password' | 'createdAt' | 'updatedAt' | 'deletedAt'
> {
  password: string;
}

export interface RegisterUserOutput extends Omit<User, 'password'> {}
