import { components } from "@/types/api";

export type Role = components["schemas"]["CreateRolDto"];
export type User = components["schemas"]["CreateUserDto"];
export type BaseProfile = components["schemas"]["UserProfileResponseDto"];

export interface Profile extends BaseProfile {
  isActive: boolean;
  lastLogin?: string;
  mustChangePassword: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  redirect?: string;
  tokens?: {
    accessToken: string;
    refreshToken: string;
  };
  user?: Profile;
}

export interface AuthState {
  user: Profile | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  setUser: (user: Profile | null) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
