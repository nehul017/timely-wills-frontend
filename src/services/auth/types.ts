import { UserInfo } from '@/store/user-info/types';

export interface LoginData {
  identifier: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName: string;
  middleName: string;
  lastName: string;
}

export interface UpdatePasswordRes {
  jwt: string;
  user: UserInfo;
}

export interface UpdatePasswordBody {
  currentPassword: string;
  password: string;
  passwordConfirmation: string;
}

export interface ResetPasswordBody
  extends Omit<UpdatePasswordBody, 'currentPassword'> {
  code: string;
}
