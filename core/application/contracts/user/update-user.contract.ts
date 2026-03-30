import { User } from '@/core/domain/entities/user.entity';

/** Input parameters for updating user information. */
export interface UpdateUserInput {
  /** The unique identifier of the user. */
  id: string;
  /** Full name of the user. */
  name?: string;
  /** Email address for the user. */
  email?: string;
  /** Contact phone number. */
  phone?: string;
  /** Unique enrollment number (matrícula). */
  enrollmentNumber?: string;
  /** Unique professional registration. */
  professionalRegistration?: string;
  /** Individual taxpayer registry number (CPF). */
  cpf?: string;
  /** Healthcare facility or workplace name. */
  workplace?: string;
  /** Optional new password to set. */
  password?: string;
  /** ID of the role assigned to the user. */
  roleId?: string;
}

/** Output of the update user operation. */
export interface UpdateUserOutput extends Omit<User, 'password'> {}
