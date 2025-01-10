export interface AuthUser {
    email: string;
    role: string[];
  }
  
  export interface LoginCredentials {
    email: string;
    password: string;
  }
  
  export interface LoginResponse {
    success: boolean;
    message?: string;
    redirect?: string;
  }