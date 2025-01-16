import { User } from '@/app/(auth)/types';

export interface ExtendedUser extends User {
  lastLogin?: string;
  isActive: boolean;
  isSuperAdmin: boolean;
  mustChangePassword: boolean;
}

export interface UserResponse {
  name: string;
  email: string;
  phone?: string;
  roles?: Array<{
    name: string;
  }>;
  isSuperAdmin: boolean;
  lastLogin?: Date;
}
