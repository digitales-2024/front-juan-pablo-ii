import type { components } from '@/types/api';
import { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Tipos base de la API
export type LoginAuthDto = components['schemas']['LoginAuthDto'];
export type UserProfileResponseDto = components['schemas']['UserProfileResponseDto'];

// Interfaces base
export interface Profile {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: Array<{ id: string; name: string }>;
  isSuperAdmin: boolean;
  isActive: boolean;
  mustChangePassword: boolean;
  lastLogin?: string;
}

// Para la respuesta de la API
export interface UserResponse {
  id: string;
  name: string;
  email: string;
  phone?: string;
  roles: Array<{ id: string; name: string }>;
  isSuperAdmin: boolean;
  headers?: {
    'set-cookie'?: string[];
    [key: string]: unknown;
  };
  config?: InternalAxiosRequestConfig;
  status?: number;
  statusText?: string;
}

export type AuthResponse = AxiosResponse<UserResponse>;

