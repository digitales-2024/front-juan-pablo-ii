export interface AuthUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  isSuperAdmin: boolean;
  roles: string[];
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface UpdatePasswordCredentials {
  email: string;
  password: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  redirect?: string;
}